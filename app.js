const spdy = require('spdy');
const express = require('express');
const fs = require('mz/fs');

const app = express();

app.use(express.static('public'));

app.get('/home', (req, res) => {
    Promise.all([
      fs.readFile('home.html'),
      fs.readFile('public/js/squareRoot.js'),
      fs.readFile('public/images/image.jpg'),
    ]).then(files => {

      // Does the browser support push?
      if (res.push){
          // The JS file
          var squareRootStream = res.push('/js/squareRoot.js', {
              req: {'accept': '**/*'},
              res: {'content-type': 'application/javascript'}
          });

          squareRootStream.on('error', err => {
            console.log(err);
          });

          squareRootStream.end(files[1]);

          // The Image
          var imageStream = res.push('/images/image.jpg', {
              req: {'accept': '**/*'},
              res: {'content-type': 'image/jpeg'}
          });

          imageStream.on('error', err => {
            console.log(err);
          });

          imageStream.end(files[2]);
      }

      res.writeHead(200);
      res.end(files[0]);
    }).catch(error => res.status(500).send(error.toString()));
});

spdy.createServer({
        key: fs.readFileSync('./privatekey.key'),
        cert: fs.readFileSync('./certificate.crt')
    }, app)
    .listen(8033, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Listening on port:  8033.');
    });
