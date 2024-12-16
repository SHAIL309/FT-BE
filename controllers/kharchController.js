const mongoose = require("mongoose");
const { kharchSchema } = require("../models");
const uuid = require("uuid");

const Kharcha = mongoose.model("Kharcha", kharchSchema);

const getAll = async (req, res) => {
  const { id } = req.user;
  const kharch = await Kharcha.find({ uid: id });
  const pendingKharch = (kharch || []).filter((k) => !k.clear);
  if (!(kharch || []).length) {
    return res.status(404).send({ message: "No Data for the user" });
  }
  return res.send({ message: "Data Found", kharch: pendingKharch });
};

const getById = async (req, res) => {
  const { kid } = req.params;
  if (!kid) {
    return res.status(400).send({ message: "Kharch Id missing" });
  }
  const kharch = await Kharcha.findOne({ kid });
  if (!kharch || kharch.clear) {
    return res.status(404).send({ message: "No entry for requested kharch" });
  }
  return res.send({ message: "Found Kharch", kharch });
};

const add = async (req, res) => {
  const { amount, date, category, description } = req.body;
  const { id } = req.user;
  const kid = uuid.v4();

  if (!amount || !date || !category || !description) {
    return res.status(400).send({ message: "Provide all fields" });
  }

  const newKharch = new Kharcha({
    uid: id,
    kid,
    amount,
    date,
    category,
    description,
  });
  try {
    await newKharch.save();
    res.status(201).json({ message: "Kharch added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const update = () => {};

const remove = async (req, res) => {
  const { kid } = req.params;
  if (!kid) {
    return res.status(400).send({ message: "Kharch Id missing" });
  }
  const kharch = await Kharcha.findOne({ kid });
  if (!kharch) {
    return res.status(404).send({ message: "No entry for requested kharch" });
  }
  kharch["clear"] = true;
  try {
    kharch.save();
    res.status(200).send({ message: "Kharch cleared" });
  } catch (err) {
    return res.status(500).send({ message: "Error clearing kharch" });
  }
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
};