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

var Emitter = require('events').EventEmitter;


/**============================================================================
 *  Ioc helper module
 */
var Ioc = module.exports = {
    deps    : deps,
    load    : load
}

//-----------------------------------------------------------------------------
// Loads dependencies
function load(deps, callback) {
    if ('object' !== typeof deps) return {};

    var result = {};

    for (var key in deps) {
        var dep = deps[key];

        // Modules are always split into two parts with a colon ':'
        var start   = dep.indexOf('[');
        var end     = dep.indexOf(']');
        var type    = dep.slice(start + 1, end);
        var module  = dep.slice(end + 1);

        if (!type || !module) continue;

        // Attach a proper loader
        var loader  = null;
        switch (type) {
            case 'npm'      : loader = this.loadNpm;      break;
            case 'node'     : loader = this.loadNode;     break;
            case 'norris'   : loader = this.loadNorris;   break;

            default : continue;
        }

        result[key] = loader.call(this, module.trim(), callback);
    }

    return result;
}

//-----------------------------------------------------------------------------
// Loads a NPM module
function loadNpm(module, callback) {
    var promise = new Emitter();

    try {
        var npmMod = require(module);
        callback(null, npmMod);
    }
    catch(e) {
        // The module is not installed. Install it now
        var installer = deps.installer;
        installer.add(module, function onAdded(err, npmMod) {
            if (err) {
                callback(err);
                promise.emit('error', err);
            }
            else {
                callback(null, npmMod);
                promise.emit('success', npmMod);
            }
        });
    }

    return promise;
}

//-----------------------------------------------------------------------------
// Loads a core Node.js module
function loadNode(module, callback) {
    return require(module);
}

//-----------------------------------------------------------------------------
// Loads a Norris API module
function loadNorris(module, callback) {
    
}