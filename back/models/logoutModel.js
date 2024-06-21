const mongoose = require("mongoose");

const logoutSchema = new mongoose.Schema({
  number: { type: String, required: true },
  name: { type: String, required: true },
  logoutTime: { type: String, required: true },
});

const logoutModel = mongoose.model("Logout", logoutSchema);

module.exports = logoutModel;
