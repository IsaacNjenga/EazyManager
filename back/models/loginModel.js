const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  number: { type: String, required: true },
  name: { type: String, required: true },
  loginTime: { type: String, required: true },
});

const loginModel = mongoose.model("Login", loginSchema);

module.exports = loginModel;
