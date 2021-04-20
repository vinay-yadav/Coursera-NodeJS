const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const hostname = "localhost";
const port = 3000;

const dbUrl = "mongodb://localhost:27017/conFusion";

mongoose
    .connect(
        dbUrl,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    )
    .then(() => console.log('db connected\n'))
    .catch(err => console.log("error in connecting with db: " + err));

app.use(morgan('dev'));

// routes
const dishes = require("./routes/dishRouter");
const promotions = require("./routes/promotionRouter");
const leaders = require("./routes/leaderRouter");

app.use('/dishes', dishes);
app.use('/promotions', promotions);
app.use('/leaders', leaders);

app.listen(
    port,
    hostname,
    () => console.log(`server is running @ http://${hostname}:${port}\n`)
)
