var IoC = require(__dirname + '/../lib/ioc');

var ioc = IoC.make(__dirname + '/fixture');
ioc.load({ ioc : '[npm] norris-ioc' }, function(err, loaded) {
    console.log(err, loaded);
});