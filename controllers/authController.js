const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const { userSchema } = require("../models/user");

const User = mongoose.model("User", userSchema);

const signIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if password matches

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Login successful",
    user: { username: user.username, id: user.uid },
  });
};

//register user
const signUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const uid = uuid.v4();
  const newUser = new User({
    uid,
    username,
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
