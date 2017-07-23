var express = require('express');
var router = express.Router();
const data = require('../data/grid');
console.log(data.words);

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Home', data: data.data, words: data.words });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
