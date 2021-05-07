const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  account: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  email: { type: String },
  mobile: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
