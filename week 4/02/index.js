const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const passport = require('passport');

const app = express();
const hostname = "localhost";
const port = 3000;

app.use(logger('dev'));

// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishes = require("./routes/dishRouter");
const promotions = require("./routes/promotionRouter");
const leaders = require("./routes/leaderRouter");
const upload = require("./routes/uploadRouter");

const dbUrl = require('./config').mongoUrl;

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

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishes);
app.use('/promotions', promotions);
app.use('/leaders', leaders);
app.use('/upload', upload);

// error handler
app.use((err, req, res, next) => res.status(err.status || 500).json(err.message));


app.listen(
    port,
    hostname,
    () => console.log(`Server is running @ http://${hostname}:${port}\n`)
)
