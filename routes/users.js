var express = require('express');

const multer = require('multer');

// Handle File uploads
var upload = multer({ dest: 'uploads/' });

var User = require('../models/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', errors: [] });
});

router.post('/register', upload.single('image--upload'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  if (req.file) {
    console.log('Uploading FIle');
    var avatar = req.file.filename;
  } else {
    console.log('No file uploaded');
    var avatar = 'default-avatar.jpg';
  }

  req.assert('name', 'Name field is required').notEmpty();
  req.assert('email', 'Valid email is required').notEmpty();
  req.assert('email', 'Valid email is required').isEmail();
  req.assert('password', '6 to 20 characters required in password').len(6, 20);
  req.assert('username', 'Username field is required').notEmpty();
  req.assert('password', 'Password field is required').notEmpty();
  req.assert('password2', 'Passwords must match').equals(req.body.password);

  req.getValidationResult().then(result => {
    if (result) {
      res.render('register', { title: 'Register', messages: '', errors: result.array() });
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
          throw err;
        }
        console.log(user);
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

module.exports = router;
