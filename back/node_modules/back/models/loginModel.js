import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  number: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String },
  loginTime: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", loginSchema);

export default LoginModel;
