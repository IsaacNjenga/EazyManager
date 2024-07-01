import mongoose from "mongoose";

const logoutSchema = new mongoose.Schema({
  number: { type: String, required: true },
  name: { type: String, required: true },
  logoutTime: { type: String, required: true },
});

const LogoutModel = mongoose.model("Logout", logoutSchema);

export default LogoutModel;
