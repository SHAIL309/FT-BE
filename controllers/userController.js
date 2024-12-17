const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../models/index");
const User = mongoose.model("User", userSchema);

const getUser = async (req, res) => {
  const user = await User.findOne({ uid: req.params.id });
  return res.send({ user });
};

const updateUser = async (req, res) => {
  const { full_name, password } = req.body;
  const allowedFields = ["full_name", "password"];
  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (!!(invalidFields || []).length) {
    return res.status(400).send({
      message: "Attempt to update Invalid fields.",
      invalidFields,
    });
  }
  const user = await User.findOne({ uid: req.params.id });

  if (full_name) user["full_name"] = full_name;
  if (password) {
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return res.status(400).send({
        message: "New password cannot be the same as the old password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user["password"] = hashedPassword;
  }

  try {
    await user.save();
    return res.status(200).send({ message: "User updated Successfully", user });
  } catch (err) {
    return res.status(500).send({ message: "Error updating user", user });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findOne({ uid: req.params.id });
  user["status"] = false;
  try {
    await user.save();
    return res.status(200).send({ message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Error deleting user" });
  }
};

module.exports = { getUser, deleteUser, updateUser };
