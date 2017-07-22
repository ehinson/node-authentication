const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-auth', {
  useMongoClient: true
  /* other options */
});

var db = mongoose.connection;

//User schema

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  }
});

var User = (module.exports = mongoose.model('User', UserSchema));

module.exports.createUser = function(newUser, callback) {
  newUser.save(callback);
};
