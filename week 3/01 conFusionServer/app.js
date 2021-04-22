const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishes = require("./routes/dishRouter");
const promotions = require("./routes/promotionRouter");
const leaders = require("./routes/leaderRouter");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

// Basic Authentication
function auth(req, res, next){
    console.log('Cookies: ', req.signedCookies);

    if(!req.signedCookies.user){
        let authHeader = req.headers.authorization;

        if(!authHeader){
            let err = new Error('Unauthenticated');

            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

        let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];

        if(username === 'admin' && password === 'qwerty'){
            res.cookie('user', 'admin', {signed: true})
            next();
        }
        else{
            let err = new Error('Incorrect Credentials');

            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
    }else{
        if(req.signedCookies.user === 'admin')
            next();
        else{
            let err = new Error('Unauthenticated');

            err.status = 401;
            return next(err);
        }
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishes);
app.use('/promotions', promotions);
app.use('/leaders', leaders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
