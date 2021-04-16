const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();

// Middle-ware
// server logs
app.use(morgan('dev'));
app.use(bodyparser.json());


// static files
app.use(express.static(__dirname + '/public'));     // __dirname ~ os.getcwd()

app.all('/hello', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text');
    next();
})

app.get('/hello/:hello', (req, res) => {
    console.log(req.params);
    res.end('yahallo ' + req.params.hello);
})

app.post('/hello', (req, res) => {
    console.log(req.body.name);
    res.end('yahallo post request: ' + req.body.name);
})

// app.use((req, res, next) => {
//     console.log(req.headers);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('Hello there!!!');
// })

const dishes = require('./urls/dishRouter');

app.use('/dish', dishes);

app.listen(port, hostname, () => console.log('server running @ ' + port));
