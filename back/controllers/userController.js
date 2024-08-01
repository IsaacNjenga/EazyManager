import express from "express";
import UserModel from "../models/userModel.js";
import LoginModel from "../models/loginModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config({ path: "./.env" });

const Register = async (req, res) => {
  const { name, number, password, role } = req.body;
  try {
    // Validation
    if (!name) {
      return res.json({
        error: [{ msg: "Name is required" }],
      });
    }
    if (!role) {
      return res.status(400).json({ error: [{ msg: "Role is required" }] });
    }
    if (!/^\d+$/.test(number)) {
      return res
        .status(400)
        .json({ error: [{ msg: "Sales ID must contain only numbers" }] });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        error: [
          {
            msg: "Password is required and should be at least 6 characters long",
          },
        ],
      });
    }

    // Check if user exists
    const exist = await UserModel.findOne({ number });
    if (exist) {
      return res.json({
        error: [{ msg: "User already exists" }],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new UserModel({
      name,
      number,
      password: hashedPassword,
      role,
    });

    // Save user to database
    const result = await newUser.save();
    result._doc.password = undefined;

    // Return success response
    return res.status(201).json({ success: true, ...result._doc });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ error: err.message });
  }
};

const Login = async (req, res) => {
  const { number, password } = req.body;
  try {
    // Find user by number
    const userExist = await UserModel.findOne({ number });
    if (!userExist) {
      return res.json({ error: "User not found" });
    }

    const name = userExist.name;
    const role = userExist.role;
    // Compare passwords
    const match = await bcrypt.compare(password, userExist.password);
    if (!match) {
      return res.json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        number: userExist.number,
        id: userExist._id,
        role: userExist.role,
        name: userExist.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Save login info to database
    const loginTime = moment().format("DD-MM-YYYY, HH:mm:ss");
    const loginInfo = new LoginModel({ number, name, loginTime, role });
    await loginInfo.save();

    const user = { ...userExist._doc, password: undefined };
    return res.status(201).json({ success: true, user, token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: error.message });
  }
};

const Auth = (req, res) => {
  return res.status(201).json({ success: true, user: { ...req.user._doc } });
};

export { Register, Login, Auth };
