# The Inversion-of-Control container for NORRIS

The core usage of the NORRIS IoC is to, well, allow NORRIS namespace modules to employ the Inversion of Control pattern.

## Installation

    npm install norris-ioc

## Usage

### Baic Usage

````javascript
// You need to call make() to create a new instance of IoC
var ioc = require('norris-ioc').make();

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

promise.on('error', function error(err) {
    console.log(err.stack);
})
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
function loadNorris(key /* the key in the deps object */, module /* the module name */, callback) {
    try {
        var norrisMod = require('/norris/' + module);
        callback(null, norrisMod);
    }
    catch(e) {
        callback(null);
    }
}

ioc.attach('norris', loadNorris);
````

Once you do that, you can use the signature `[norris]` anywhere in your code to load the right modules, your way.

````javascript
var deps = {
    installer : '[norris] installer'
}

ioc.load(deps, function(err, loaded) {
    if (!err) {
        // Make sure the installer is loaded
        var installer = loaded.installer;
        assert.isFunction(installer['install']);
    }
});

var promise = ioc.load(deps);
promise.on('success', function(loaded) {
    // Make sure the installer is loaded
    var installer = loaded.installer;
    assert.isFunction(installer['install']);
});

promise.on('error', function(err) {
    console.log(err.stack);
})
````

### Replacing signatures

The true purpose of IoC containers isn't just to streamline your project's dependency graph. It is also heavily useful during unit tests when you need to replace existing modules with mock ones.

To achieve this, you will need to replace the current signatures with your own. This is extremely simple. Just define your own loaders and attach them to existing signatures:

````javascript
var deps = {
    express : '[npm] express',
    io      : '[npm] socket.io',
    fs      : '[node] fs',
    path    : '[node] path'
}

ioc.attach('npm', myNpmMocks)
   .attach('node', myNodeMocks); 

// Load it
ioc.load(deps);
````

## License

Copyright (c) 2011 Ruben L Z Tan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISINGFROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.