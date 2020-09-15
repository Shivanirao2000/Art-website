var express = require ("express");
var router = express.Router();
const Joi = require('joi');
var passport = require("passport");
var User = require("../models/user");
const randomstring = require('randomstring');
const mailer = require('../misc/mailer');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandbox6895adad6a8545f5bf2702521cc5dca3.mailgun.org';
// const key= '0abd07500c9c26b95cbfc3dc09475b9c-d5e69b0b-d556f644';
// const mg = mailgun({apiKey: key, domain: DOMAIN});

router.get("/", function(req,res){
	res.render("landing.ejs")
});

// router.get("/register", function(req,res){
// 	res.render("register");
// });

// router.post("/register", function(req,res){
// 	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
// 		if(err){
// 			req.flash("error", err.message)
// 			return res.redirect("/register");
// 		}
// 		passport.authenticate("local")(req, res, function(){
// 			req.flash("success", "Welcome to Sierra! "+ user.username)
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });

// Validation Schema
const userSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	username: Joi.string().required(),
	password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  });

// Authorization 
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
	  return next();
	} else {
	  req.flash('error', 'Sorry, but you must be registered first!');
	  res.redirect('/');
	}
  };
  
  const isNotAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
	  req.flash('error', 'Sorry, but you are already logged in!');
	  res.redirect('/');
	} else {
	  return next();
	}
  };
  

router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      const result = userSchema.validate(req.body);
      if (result.error) {
        req.flash('error', 'Data is not valid. Please try again.');
        res.redirect('/register');
        return;
      }

      // Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/register');
        return;
      }

      // Hash the password
      // const hash = await User.hashPassword(result.value.password);

const secretToken = randomstring.generate();
console.log('secretToken', secretToken);

// Save secret token to the DB
result.value.secretToken = secretToken;

// Flag account as inactive
result.value.active = false;

// Save user to DB
// delete result.value.confirmationPassword;
// result.value.password = hash;

const newUser = await new User(result.value); 
console.log('newUser', newUser);
await newUser.save();

// const data = {
// 	from: 'noreply@gmail.com',
// 	to: result.value.email,
// 	subject: 'Please verify your email!',
// 	text: html
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });

// Compose email
const html = `Hi there,
<br/>
Thank you for registering!
<br/><br/>
Please verify your email by typing the following token:
<br/>
Token: <b>${secretToken}</b>
<br/>
On the following page:
<a href="https://whispering-fortress-95384.herokuapp.com/verify">https://whispering-fortress-95384.herokuapp.com/verify</a>
<br/><br/>
Have a pleasant day.` 

//Send email
await mailer.sendEmail('Sierra_admin@gmail.com', result.value.email, 'Please verify your email!', html);

req.flash('success', 'Please check your email (SPAM) for the verification code');
res.redirect('/login');
} catch(error) {
next(error);
}
});

// forgot password

router.get('/forgot', function(req, res) {
  res.render('forgot');
});

var generateResetToken = () => {
  return new Promise((resolve, reject) => {
    // crypto random bytes has a callback.
    // randombytes(size[, callback])
    crypto.randomBytes(20, (err, buf) => {
      if (err) reject(err);
      else {
        let reset_token = buf.toString('hex');
        resolve(reset_token);
      }
    })
  })
}

router.post('/forgot', async (req, res) => {
  try {
		// generate reset token to send.
		let reset_token = await generateResetToken();
		console.log(reset_token);

		// find the specified user by email.
		let user = await User.findOne({email: req.body.email});
		if (!user) {
      req.flash('error', 'No account with that email address.');
			throw 'user not found.'
		}
		user.resetPasswordToken = reset_token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in ms
		// passport local mongoose allows for promises inherently.
    await user.save();
    
    const html2='You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/reset/' + reset_token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    await mailer.sendEmail('Sierra_admin@gmail.com', req.body.email, 'Reset Password', html2);

    req.flash('success', 'Please check your email (SPAM) to reset password');
    res.redirect('/forgot');
  }catch(error) {
    console.log(error);
    res.redirect('/forgot');
  };
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    // if (!user) {
    //   req.flash('error', 'Password reset token is invalid or has expired.');
    //   return res.redirect('/forgot');
    // }
    res.render('reset', {token: req.params.token});
  });
});

router.post("/reset/:token", async (req, res) => {
  try {
    let user = await User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      }
    );
  
    // if(!user){
    //   req.flash("error", "Password reset token is invalid or has expired.");
    //   return res.redirect("back");
    // }
  
    if (req.body.password === req.body.confirm){  
      console.log(req.body.password);    
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      // await user.setPassword(req.body.password);
      user.password=req.body.password;
      await user.save();   
       
    } else {
      req.flash("error", "Passwords do not match.");
      return res.redirect("back");
    }   

    req.flash("success", "Success! Your password has been changed.");
    res.redirect("/login");

  } catch (error) {
    console.log(error);
    req.flash("error", "Something is wrong...");
    
  }  
});

router.route('/login')
  .get(isNotAuthenticated, (req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.route('/verify')
  .get(isNotAuthenticated, (req, res) => {
    res.render('verify');
  })
  .post(async (req, res, next) => {
    try {
      const { secretToken } = req.body;

      // Find account with matching secret token
      const user = await User.findOne({ 'secretToken': secretToken });
      if (!user) {
        req.flash('error', 'No user found.');
        res.redirect('/verify');
        return;
      }

      user.active = true;
      user.secretToken = '';
      await user.save();

      req.flash('success', 'Thank you! Now you may login.');
      res.redirect('/login');
    } catch(error) {
      next(error);
    }
  })

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged out")
	res.redirect("/campgrounds");
});

// router.route('/logout')
//   .get(isAuthenticated, (req, res) => {
//     req.logout();
//     req.flash('success', 'Successfully logged out. Hope to see you soon!');
//     res.redirect('/');
//   });


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

