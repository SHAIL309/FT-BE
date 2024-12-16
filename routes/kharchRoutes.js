const express = require("express");
const mongoose = require("mongoose");
const {
  getAll,
  getById,
  add,
  update,
  remove,
} = require("../controllers/kharchController");

const { userSchema } = require("../models");

const route = express.Router();
const User = mongoose.model("User", userSchema);

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

route.get("/", getAll);
route.get("/:kid", getById);
route.post("/", add);
route.put("/:kid", update);
route.delete("/:kid", remove);

module.exports = route;
