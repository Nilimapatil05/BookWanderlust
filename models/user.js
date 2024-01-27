const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  //   here username and password will automatically define in passport local mongoose
  //   no need to define in this schema
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
