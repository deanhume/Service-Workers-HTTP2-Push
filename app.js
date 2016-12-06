const spdy = require('spdy');
const express = require('express');
const fs = require('mz/fs');

const app = express();

app.use(express.static('public'));

app.get('/nopush', (req, res) => {
    fs.readFile('home.html')
      .then(file => {
        res.writeHead(200);
        res.end(file);
      })
      .catch(error => res.status(500).send(error.toString()));
});

app.get('/example', (req, res) => {
    Promise.all([
      fs.readFile('home.html'),
      fs.readFile('public/js/promise.min.js'),
      fs.readFile('public/js/fetch.js'),
    ]).then(files => {

      // Does the browser support push?
      if (res.push){
          // The JS file
          var promiseJs = res.push('/js/promise.min.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          });

          promiseJs.on('error', err => {
            console.log(err);
          });

          promiseJs.end(files[1]);

          var fetchJs = res.push('/js/fetch.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          });

          fetchJs.on('error', err => {
            console.log(err);
          });

          fetchJs.end(files[2]);
      }

      res.writeHead(200);
      res.end(files[0]);
    }).catch(error => res.status(500).send(error.toString()));
});

spdy.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
    .listen(8022, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Listening on port:  8022.');
    });
