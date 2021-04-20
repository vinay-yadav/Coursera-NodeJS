const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const hostname = 'localhost';
const port = 3000;

const mongoUrl = "mongodb://localhost:27017/conFusion";

// db connection
mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('db connected'))
    .catch(err => console.log('error in connecting db: ' + err));

app.use(morgan('dev'));

// routes
const dish = require('./routes/dishRouter');

app.use('/dishes', dish);


app.listen(port, hostname, () => console.log('server is running'));
