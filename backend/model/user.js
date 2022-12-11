var mongoose = require('mongoose');

userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String},
	courses:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
  });

var passportLocalMongoose = require('passport-local-mongoose');
userSchema.plugin(passportLocalMongoose);
user = mongoose.model('user', userSchema);
module.exports = user;


