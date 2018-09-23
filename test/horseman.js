var Horseman = require('node-horseman');
var horseman = new Horseman();

console.log('Start script');
var server = require('./server.js');


module.exports = function (injectJs, evaluate) {


  server.listen(3000, function () {
    console.log('Server ready');

    var stop = function () {
      server.close(function() { console.log('Doh :('); });
    }

    horseman = horseman
      .userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246')
      .on('error', console.error)
      .on('consoleMessage', function( msg ){
          console.log('consoleMessage', msg);
      })
      .on('resourceError', function(err) {
          console.log('resourceError', err);
      })
      .open('http://localhost:3000');

    if (typeof injectJs == 'object') {
      for (var o in injectJs) {
        horseman = horseman.injectJs(injectJs[o]);
      }
    } else {
      horseman = horseman.injectJs(injectJs);
    }

    horseman.evaluate(evaluate)
      .then(function(data) {
        console.log(data);
        stop();
      })
      .catch(function (data) {
        console.log(data);
        stop();
      });

  });
}
