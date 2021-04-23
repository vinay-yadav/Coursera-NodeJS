const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/User');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', (req, res, next) => {
	User.register(
		new User({'username': req.body.username}),
		req.body.password,
		(err, user) => {
			if(err)
				return res.status(500).json({err: err})
			
			passport.authenticate('local')(req, res, () => {
				res.status(201).json({success: 'Registration successful'});
			});
		}
	)
});


router.post('/login', passport.authenticate('local'), (req, res, next) => {
	res.json({success: 'login successful'});
})

router.get('/logout', (req, res) => {
	console.log('request: ', req.session);
	if(req.user){
		req.session.destroy();
		res.clearCookie('session-name');
		res.redirect('/');
	}else{
		res.status(403);
		res.json('not logged in');
	}
})

module.exports = router;
