const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var mongoURI = 'mongodb://localhost/node-auth';

mongoose.connect(process.env.MONGODB_URI || mongoURI, {
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

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
};

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
