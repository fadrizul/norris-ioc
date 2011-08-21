/**
 * NORRIS.js
 * Copyright (c) 2011 Ruben L Z Tan
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 */
'use strict';

var Emitter     = require('events').EventEmitter;
var Installer   = require(__dirname + '/installer');

//=============================================================================
// Ioc helper module definition
var Ioc = module.exports = {
    // Properties
    basepath    : '',
    installer   : null,
    loader      : {
        npm     : null, 
        node    : null
    },

    // Methods
    make        : make,
    attach      : attach,
    load        : load
}

//-----------------------------------------------------------------------------
// Creates a fresh instance of IoC
function make(basepath) {
    var loader = {
        npm     : loadNpm,
        node    : loadNode
    }

    var installer = Installer.make();

    var o = Object.create(this, {
        installer   : { value : installer,  enumerable : true, writable : true, configurable : false },
        basepath    : { value : basepath,   enumerable : true, writable : true, configurable : false },
        loader      : { value : loader,     enumerable : true, writable : true, configurable : false }
    });

    return o;
}

//-----------------------------------------------------------------------------
// Attach a function to load a new module
function attach(signature, fn) {
    this.loader[signature] = fn;
    return this;
}

//-----------------------------------------------------------------------------
// Loads dependencies
function load(deps, callback) {
    if ('object' !== typeof deps) {
        throw new Error('Expecting first argument to be an object defining the dependencies to be loaded');
    }

    var self    = this;
    var result  = new Emitter();
    var promise = new Emitter();
    var types   = Object.keys(this.loader);
    var loaded  = {};

    self.installer.ready(this.basepath, function onMake() {
        // If callbacks are not used, pump in a dummy function
        if (undefined === callback) {
            callback = function() {};
        }

        // Propagate the error event to the resulting callback
        promise.on('error', function onError(err) {
            process.nextTick(function() {
                result.emit('error', err, module);
                callback(err);
            });
        });

        // Add the successful loading of the module to the returned dep object
        promise.on('success', function onSuccess(moduleName, module) {
            loaded[moduleName] = module;
            delete deps[moduleName];

            if (0 === Object.keys(deps).length) {
                process.nextTick(function() {
                    result.emit('success', loaded);
                    callback(null, loaded);
                });
            }
        });

        // Run through all the dependencies, loading as we go
        for (var key in deps) {
            var dep = deps[key];

            // Modules are always split into two parts with a colon ':'
            var start   = dep.indexOf('[');
            var end     = dep.indexOf(']');
            var type    = dep.slice(start + 1, end);
            var module  = dep.slice(end + 1).trim();

            if (!type || !module) {
                continue;
            }

            // Use the proper loader function
            if (-1 !== types.indexOf(type)) {
                self.loader[type].call(self, module, function onLoaded(err, res) {
                    if (err) {
                        promise.emit('error', err, module);
                    } else {
                        promise.emit('success', key, res);
                    }
                });
            }
        }    
    });

    return result;
}

//-----------------------------------------------------------------------------
// Loads a NPM module
function loadNpm(module, callback) {
    var self = this;
    self.installer.install(module, callback);
}

//-----------------------------------------------------------------------------
// Loads a core Node.js module
function loadNode(module, callback) {
    try {
        var nodeMod = require(module);
        callback(null, nodeMod);
    } catch(err) {
        callback(err);
    }
}