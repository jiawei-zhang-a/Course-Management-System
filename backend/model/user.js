var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // name: { type: String, required: false },
  // email: { type: String, required: false },
  password: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
});

var passportLocalMongoose = require("passport-local-mongoose");
userSchema.plugin(passportLocalMongoose);
var user = mongoose.model("user", userSchema);
module.exports = user;
