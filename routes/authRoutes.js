const express = require("express");
const {
  signIn,
  forgotPassword,
  signUp,
  passwordReset,
} = require("../controllers/authController");

const route = express.Router();

route.post("/signin", signIn);
route.post("/signup", signUp);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", passwordReset);

module.exports = route;
