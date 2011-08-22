var fs      = require('fs');
var path    = require('path');
var wrench  = require('wrench');
var vows    = require('vows');
var assert  = require('assert');
var Emitter = require('events').EventEmitter;
var IoC     = require(__dirname + '/../lib/ioc');

var suite   = vows.describe('IoC test suite');
/*
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
            ioc.attach('node', function loadFsMock(key, module, callback) {
                var nodeMod = { chuckNorris : true };
                callback(null, key, nodeMod);
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
*/

var norrisMockDir = __dirname + '/fixture/node_modules/norris-ioc';

// Test the loading of npm modules
suite.addBatch({
    'GIVEN that we want to test if norris-ioc can load npm modules' : {
        topic : function topic() {
            // Make sure to wipe out the fixture directory
            try {
                wrench.rmdirSyncRecursive(norrisMockDir);
            } catch (err) {}

            return IoC.make(__dirname + '/fixture');
        },

        'WHEN we load "norris-ioc" using callback style' : {
            topic : function topic(ioc) {
                ioc.load({ ioc : '[npm] norris-ioc', fs : '[node] fs' }, this.callback);
            },

            'THEN the "norris-ioc" module should be loaded successfully' : function testNpmLoad(err, loaded) {
                var ioc = loaded.ioc;
                assert.isObject(ioc);
                assert.isFunction(ioc.make);
                assert.isFunction(ioc.load);
            },

            'THEN the "norris-ioc" module should be in the fixture dir' : function testNorrisMockDir(err, loaded) {
                // Check the directory
                var files   = fs.readdirSync(norrisMockDir);
                assert.isTrue(-1 !== files.indexOf('package.json'));

                var meta    = JSON.parse(fs.readFileSync(norrisMockDir + '/package.json'));
                assert.equal(meta.name, 'norris-ioc');
            }
        }
    }
});

suite.export(module);