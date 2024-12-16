const express = require("express");
const mongoose = require("mongoose");
const { userSchema } = require("../models/user");
const {
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const User = mongoose.model("User", userSchema);

const route = express.Router();

route.param("id", async (req, res, next, id) => {
  if (!id) {
    return res.status(401).send({ message: "User id is required" });
  }

  const user = await User.findOne({ uid: id });
  if (!user || !user.status) {
    return res.status(404).send({ message: "user not found" });
  }

  if (user.uid !== req.user.id) {
    return res.status(403).send({ message: "Invalid Id" });
  }

  next();
});

route.get("/:id", getUser);
route.put("/:id", updateUser);
route.delete("/:id", deleteUser);

module.exports = route;
