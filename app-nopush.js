const port = 3000;
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('*', (req, res) => {
    res
      .status(200)
      .json({message: 'ok'})
});


spdy
    .createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
    .listen(8099, (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Listening on port:  8099.');
    });
