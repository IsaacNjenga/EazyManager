import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    number: { type: String, unique: true },
    role: String,
    password: String,
  },
  { collection: "users", timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
