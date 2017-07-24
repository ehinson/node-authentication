var express = require('express');
var router = express.Router();
const data = require('../data/grid');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  var wordarray = [];
  var foo = data.getWords().then(resp => {
    resp.map(item => {
      wordarray.push(item.word);
    });
    data['words'] = wordarray;
    console.log(data);
    res.render('index', { title: 'Home', data: data.data, words: data.words });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
