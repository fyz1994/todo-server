const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const RefreshTokenScheme = new Scheme({
  token: { type: String },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenScheme);
