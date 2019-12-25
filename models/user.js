var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
});

/*  Hash the password before we even save it to the database */
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
  
  /* compare password in the database and the one that the user type in */
  UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }


module.exports = mongoose.model("User", UserSchema);