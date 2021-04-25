const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/User');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

/* GET users listing. */
router
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
        User.find()
            .then(users => res.json(users))
            .catch(err => next(err));
    });

router
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post('/sign-up', cors.corsWithOptions, (req, res, next) => {
        User.register(
            new User({'username': req.body.username}),
            req.body.password,
            (err, user) => {
                if (err)
                    return res.status(500).json({err: err})

                if (user) {
                    // if (req.body.admin)
                    //     user.admin = req.body.admin;
                    if (req.body.firstName)
                        user.firstName = req.body.firstName;
                    if (req.body.lastName)
                        user.lastName = req.body.lastName;

                    user.save()
                        .then(user => {
                            passport.authenticate('local')(req, res, () => {
                                return res.status(201).json({success: 'Registration successful'});
                            });
                        })
                        .catch(err => console.log('err in setting admin: ' + err));
                }
            }
        )
    });


router
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
        const token = authenticate.getToken({_id: req.user._id});
        res.json({success: 'login successful', token: `Bearer ${token}`});
    })

router.get('/logout', (req, res) => {
    console.log('request: ', req.session);
    if (req.user) {
        req.session.destroy();
        res.clearCookie('session-name');
        res.redirect('/');
    } else {
        res.status(403);
        res.json('not logged in');
    }
})

module.exports = router;
