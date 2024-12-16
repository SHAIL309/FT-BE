const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../models/index");

const User = mongoose.model("User", userSchema);

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

module.exports = {
  signUp,
  signIn,
};
