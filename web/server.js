var express = require('express');
var ejs     = require('ejs');
var fs      = require('fs');
var config  = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf-8'));
var exec    = require('child_process').exec;

var server = express.createServer();
server.configure(function() {
    server.register('html', ejs);
    server.set('view engine', 'html');
    server.set('views', __dirname + '/view');

    server.use(server.router);
    server.use(express.static(__dirname + '/public'));
});

server.get('/', function(req, res) {
    res.render('index.html', { layout : false });
});

// github post-receive hook
server.post('/update', function(req, res) {
    var payload = req.params('payload');

    res.send(200);
});

server.listen(config.port);