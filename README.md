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
        assert.isFunction(express['createServer']);

        // Socket.io should be properly loaded
        var io = loaded.io;
        assert.isFunction(io['listen']);

        // Fs should be properly loaded
        var fs = loaded.fs;
        assert.isFunction(fs['readFile']);

        // Path should be properly loaded
        var path = loaded.path;
        assert.isFunction(path['exists']);
    }
});

// Getting the results promise style
var promise = ioc.load(deps);
promise.on('success', function success(loaded) {
    // Express should be properly loaded
    var express = loaded.express;
    assert.isFunction(express['createServer']);

    // Socket.io should be properly loaded
    var io = loaded.io;
    assert.isFunction(io['listen']);

    // Fs should be properly loaded
    var fs = loaded.fs;
    assert.isFunction(fs['readFile']);

    // Path should be properly loaded
    var path = loaded.path;
    assert.isFunction(path['exists']);
});
````

The above will cause norris-ioc to load `express` and `socket.io` from the node_modules folder, and `fs` and `path` from node's core library.

As seen from the code example above, you can either use callbacks or promises to get the results you want, depending on your use case.

But the real power of norris-ioc doesn't stop here.

### Adding signatures

Norris-ioc relies on what I call a `signature` to know what to load. In the previous code example, you see this:

````javascript
var deps = {
    express : '[npm] express',
    io      : '[npm] socket.io',
    fs      : '[node] fs',
    path    : '[node] path'
}
````

A `signature` is enclosed within a square bracket (e.g. `[npm] express` signature is `npm`). By default, norris-ioc supports two default signatures: `npm` and `node`.

The `npm` signature will automatically install an npm module straight from the npm directory if it doesn't exist in your project, while the `node` signature will load a module from node.js' core API.

You can add your own signatures to the IoC container. Doing this is simple - just provide a signature keyword along with a callback:

````javascript
function loadNorris(promise, module, callback) {
    try {
        var norrisMod = require('/norris/' + module);
        callback(null, norrisMod);
        promise.emit('success', norrisMod);
    }
    catch(e) {
        callback(null);
        promise.emit('error', norrisMod);
    }

    return promise;
}

ioc.attach('norris', loadNorris);
````

