import express from "express";
import LogoutModel from "../models/logoutModel.js";
import LoginModel from "../models/loginModel.js";

const logins = (req, res) => {
  LoginModel.find({})
    .then((logins) => res.json(logins))
    .catch((err) => res.json(err));
};

const logouts = (req, res) => {
  LogoutModel.find({})
    .then((logouts) => res.json(logouts))
    .catch((err) => res.json(err));
};

export { logouts, logins };
