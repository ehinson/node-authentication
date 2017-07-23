var express = require('express');
var router = express.Router();
const data = require('../data/grid');
var arrayarray = [];
var foo = data.getWords().then(res => {
  res.map(item => {
    arrayarray.push(item.word);
  });
  return arrayarray;
});

data['words'] = foo;
console.log(data);
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
