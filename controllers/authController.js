const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { userSchema, tokenSchema } = require("../models/index");

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if password matches

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.uid }, process.env.SECRET_KEY);
  res.status(200).json({
    message: "Login successful",
    user: {
      email: user.email,
      name: user.full_name,
      id: user.uid,
      token: token,
    },
  });
};

//register user
const signUp = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "email already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const uid = uuid.v4();
  const newUser = new User({
    uid,
    full_name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user.email });
    if (!token) {
      token = await new Token({
        userId: user.email,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user.email}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occurred");
    console.log(error);
  }
};
const passwordReset = async (req, res) => {
  const { email, token } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("invalid link or expired");

    const userToken = await Token.findOne({
      userId: email,
      token: token,
    });
    if (!userToken) return res.status(400).send("Invalid link or expired");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();
    await userToken.deleteOne({ token: token });

    res.send("password reset successfully.");
  } catch (error) {
    res.send("An error occurred");
    console.log(error);
  }
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  passwordReset,
};
