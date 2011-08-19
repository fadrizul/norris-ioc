# The Inversion-of-Control container for NORRIS

The core usage of the NORRIS IoC is to, well, allow NORRIS namespace modules to employ the Inversion of Control pattern.

## Installation

    npm install norris-ioc

## Usage

### Baic Usage

````javascript
var ioc = require('norris-ioc');

var deps = {
    express : '[npm] express',
    io      : '[npm] socket.io',
    fs      : '[node] fs',
    path    : '[node] path'
}

// Getting the results callback style
ioc.load(deps, function(err, loaded){
    if (!err) {
        // Express should be properly loaded
        var express = loaded.express;
        assert.isObject(express);
        assert.isFunction(express['createServer']);

        // Socket.io should be properly loaded
        var io = loaded.io;
        assert.isObject(io);
        assert.isFunction(io['listen']);

        // Fs should be properly loaded
        var fs = loaded.fs;
        assert.isObject(fs);
        assert.isFunction(fs['readFile']);

        // Path should be properly loaded
        var path = loaded.path;
        assert.isObject(path);
        assert.isFunction(path['exists']);
    }
});

// Getting the results promise style
var promise = ioc.load(deps);
promise.on('ready', function ready(loaded) {
    // Express should be properly loaded
    var express = loaded.express;
    assert.isObject(express);
    assert.isFunction(express['createServer']);

    // Socket.io should be properly loaded
    var io = loaded.io;
    assert.isObject(io);
    assert.isFunction(io['listen']);

    // Fs should be properly loaded
    var fs = loaded.fs;
    assert.isObject(fs);
    assert.isFunction(fs['readFile']);

    // Path should be properly loaded
    var path = loaded.path;
    assert.isObject(path);
    assert.isFunction(path['exists']);
});
````

The above will cause norris-ioc to load `express` and `socket.io` from the node_modules folder, and `fs` and `path` from node's core library.

