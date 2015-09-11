var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var Mailer = require('../functions/mailer.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req,res,next){
	if(!req.body.username || !req.body.password || !req.body.email){
		return res.status(400).json({message: "Please fill out all required forms"})
	}
	var user = new User()
	user.username = req.body.username
	user.email = req.body.email
	user.setPassword(req.body.password)

	user.save(function(err){
		if(err){
			console.log("Stuff");
			return next(err);
		}
		var mailer = new Mailer(user.email, user._id, user.username)
  		mailer.sendEmail()
		return res.json({message: "User successfully registered"})
	})
})

router.get('/users', function(req,res,next){
	User.find(function(err,users){
		if(err){return next(err);}
		res.json(users)
	})
})

router.get('/deleteUsers', function(req,res,next){
	User.remove(function(err,users){
		if(err){return next(err);}
		res.json(users)
	})
})

router.param('user', function(req,res,next,id){
	var query = User.findById(id);

	query.exec(function(err,user){
		if(err){return next(err);}
		if(!user){return next(new Error('can\'t find user'))}
		user.activate();
		req.user = user;
		return next();
	})
})

router.get('/login/:user', function(req,res,next){
	res.json(req.user.username);
})

router.post('/login', function(req,res,next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: "Please fill out all required forms"})
	}
	persist = req.body.checkbox
	passport.authenticate('local', function(err,user,info){
		if(err){return next(err);}
		if(user){
			return res.json({token: user.generateJWT()})
		}else{
			return res.status(401).json(info)
		}
	})(req,res,next);

})
module.exports = router;