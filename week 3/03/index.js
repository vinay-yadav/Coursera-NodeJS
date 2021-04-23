const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

const app = express();
const hostname = "localhost";
const port = 3000;


// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishes = require("./routes/dishRouter");
const promotions = require("./routes/promotionRouter");
const leaders = require("./routes/leaderRouter");

app.use(session({
    name: 'session-name',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());


function auth(req, res, next){
    if(!req.user)
        res.status(403).json('not authenticated, login first');
    else
        next();
}


app.use(logger('dev'));

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

app.use(auth);

app.use('/dishes', dishes);
app.use('/promotions', promotions);
app.use('/leaders', leaders);


app.listen(
    port,
    hostname,
    () => console.log(`Server is running @ http://${hostname}:${port}\n`)
)
