const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    number: { type: String, unique: true },
    role:String,
    password: String,
  },
  { collection: "users" }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
