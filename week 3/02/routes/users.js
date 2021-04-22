const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', (req, res, next) => {
	console.log(req.body);
	User.findOne({'username': req.body.username})
			.then(user =>{
				if(user){
					return res.status(403).json({registrationError: 'user with username already exists'});
				}
				
				User.create(req.body)
					.then(user => {
						if(!user)
							return res.status(400).json({registrationError: 'Error in registering user'});
						
						res.json(user);
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
});


router.post('/login', (req, res, next) => {
	if(!req.session.user){
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

		User.findOne({'username': username})
		.then(user => {
			if(!user){
				return res.status(404).json('username does not exists');
			}

			if(user.password == password){
				req.session.user = 'authenticated';
				res.json('login success');
			}else{
				res.status(403).json('incorrect password');
			}
		})
		.catch(err => res.json('error in login process: ' + err));
    }else{
		res.json('already logged in');
	}
})

router.get('/logout', (req, res) => {
	console.log('request: ', req.session);
	if(req.session.user){
		req.session.destroy();
		res.clearCookie('session-name');
		res.redirect('/');
	}else{
		res.status(403);
		res.json('not logged in');
	}
})

module.exports = router;
