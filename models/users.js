const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const UserScheme = new Scheme({
  account: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  email: { type: String },
  mobile: { type: String },
});

module.exports = mongoose.model("User", UserScheme);
