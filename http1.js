const express = require('express');
const fs = require('mz/fs');

const app = express();

app.use(express.static('public'));

app.get('/http1', (req, res) => {
    fs.readFile('home.html')
        .then(file => {
            res.writeHead(200);
            res.end(file);
        })
        .catch(error => res.status(500).send(error.toString()));
});

app.listen(8022, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log('Listening on port:  8022.');
});
