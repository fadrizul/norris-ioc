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

var npm = require('npm');
var fs  = require('fs');

//=============================================================================
// Installer module definition
var Installer = module.exports = {
    basepath    : '',

    // Methods
    make        : make,
    ready       : ready,
    install     : install
}

//-----------------------------------------------------------------------------
// Creates a new instance of the installer
function make() {
    return Object.create(this, {
        basepath : { value : '', enumerable : true, writable : true, configurable : false }
    });
}

//-----------------------------------------------------------------------------
// Configures npm properly for installation operations
function ready(basepath, cb) {
    var self    = this;
    var config  = {
        loglevel    : 'silent',
        outfd       : ''
    }

    if ('' !== basepath) {
        config.prefix = basepath;
        this.basepath = basepath;
    }

    npm.load(config, cb);

    return this;
}

//-----------------------------------------------------------------------------
// Installs an npm module
function install(module, callback) {
    var basepath = this.basepath;

    npm.commands.install([module], function onInstall(err, data) {
        if (err) {
            callback(err);
        } else {
            try {
                var modpath = basepath + '/node_modules/' + module;
                var meta    = JSON.parse(fs.readFileSync(modpath + '/package.json', 'utf-8'));

                if (undefined === meta.main) {
                    callback(new Error('No "main" file defined. I don\'t know how to load this'));
                } else {
                    var npmMod = require(modpath + '/' + meta.main);
                    callback(null, npmMod);
                }
            } catch (err) {
                callback(err);
            }
        }
    });

    return this;
}




