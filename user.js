const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "username cannot be blank"],
  },
  password: {
    type: String,
    require: [true, "password cannot be blank"],
  },
});

userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });

  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

module.exports = mongoose.model("Users", userSchema);
