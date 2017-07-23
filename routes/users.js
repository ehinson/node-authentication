var express = require('express');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

const multer = require('multer');
var router = express.Router();
// Handle File uploads
var upload = multer({ dest: 'uploads/' });

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', errors: '' });
});

router.post('/register', upload.single('image--upload'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  if (req.file) {
    console.log('Uploading File', req.file);
    var avatar = req.file.filename;
  } else {
    console.log('No file uploaded');
    var avatar = 'default-avatar.png';
  }

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Valid email is required').notEmpty();
  req.checkBody('email', 'Valid email is required').isEmail();
  req.checkBody('password', '6 to 20 characters required in password').len(6, 20);
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords must match').equals(req.body.password);

  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.render('register', { title: 'Register', errors: result.array() });
    } else {
      var newUser = new User({
        username: username,
        email: email,
        name: name,
        password: password,
        avatar: avatar
      });
      User.createUser(newUser, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          console.log(user);
        }
      });
      req.flash('success', 'You are now registered and can log in');
      res.location('/');
      res.redirect('/');
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or passowrd' }),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  })
);

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
