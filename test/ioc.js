var fs      = require('fs');
var path    = require('path');
var vows    = require('vows');
var assert  = require('assert');
var Emitter = require('events').EventEmitter;
var IoC     = require(__dirname + '/../lib/ioc');

var suite = vows.describe('IoC test suite');

// Test loading of node modules
suite.addBatch({
    'GIVEN that we want to test if norris-ioc can load node modules' : {
        topic : function topic() {
            return IoC.make();
        },

        'WHEN we load "fs" using callback style' : {
            topic : function topic(ioc) {
                ioc.load({ fs : '[node] fs' }, this.callback);
            },

            'THEN the "fs" module should be loaded successfully' : function testCallback(err, loaded){
                var fs = loaded.fs;
                assert.isNull(err);
                assert.isObject(fs);
                assert.isFunction(fs['readdir']);
                assert.isFunction(fs['readFile']);
            }
        },

        'WHEN we load "fs" using promise style' : {
            topic : function topic(ioc) {
                var promise = ioc.load({ fs : '[node] fs' });
                return promise;
            },

            'THEN the "success" event should be fired successfully' : function testPromise(err, loaded) {
                var fs = loaded.fs;
                assert.isObject(fs);
                assert.isFunction(fs['readdir']);
                assert.isFunction(fs['readFile']);
            }
        }
    },

    'GIVEN that we want to test if we can replace the node signature' : {
        topic : function topic() {
            var ioc = IoC.make();
            ioc.attach('node', function loadFsMock(module, callback) {
                var nodeMod = { chuckNorris : true };
                callback(null, nodeMod);
            });
            return ioc;
        },

        'WHEN we load "fs" using callback style' : {
            topic : function topic(ioc) {
                ioc.load({ fs : '[node] fs' }, this.callback);
            },

            'THEN the "fs" module should be loaded successfully' : function testMockCallback(err, loaded) {
                var fs = loaded.fs;
                assert.isNull(err);
                assert.isObject(fs);
                assert.isUndefined(fs['readdir']);
                assert.isTrue(fs.chuckNorris);
            }
        },

        'WHEN we load "fs" using promise style' : {
            topic : function topic(ioc) {
                return ioc.load({ fs : '[node] fs' });
            },

            'THEN the "success" event should be fired successfully' : function testMockPromise(loaded) {
                var fs = loaded.fs;
                assert.isObject(fs);
                assert.isUndefined(fs['readdir']);
                assert.isTrue(fs.chuckNorris);
            }
        }
    }
});

// Function to check whether an npm module has been successfully installed
function hasModule(err, data, callback) {
    
}

// Test the loading of npm modules
suite.addBatch({
    'GIVEN that we want to test if norris-ioc can load npm modules' : {
        topic : function topic() {
            return IoC.make(__dirname + '/fixture');
        },

        'WHEN we load an existing module `npm-valid` using callback style' : {
            topic : function topic(ioc) {
                var self = this;

                /*ioc.load({ valid : '[npm] npm-valid' }, function onLoad(err, data) {
                    if (err) {
                        self.callback(err);
                        return;
                    } else {
                        // Check the file system to see if the folder is still there
                        fs.readdir(__dirname + '/fixture/node_modules', function onReddir(err, files) {
                            if (err) {
                                self.callback(err);
                            } else {
                                
                            }
                        });
                    }
                });*/
                return false;
            },

            'THEN the "npm-valid" module should not be installed (use back existing modules)' : function testValidNpm(err, data) {
                
            }
        }
    }
});

suite.export(module);