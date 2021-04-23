const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const key = require('./config').secretkey;

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function (user) {
    return jwt.sign(user, key, {
        expiresIn: 3600
    })
};


let opts = {}
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    console.log('PayLoad: ', jwt_payload);
    User.findById(jwt_payload._id)
        .then(user => {
            if (user)
                return done(null, user);
            return done(null, false);
        })
        .catch(err => console.log('err in jwt_payload: ' + err));
}))

exports.verifyUser = passport.authenticate('jwt', {session: false});
