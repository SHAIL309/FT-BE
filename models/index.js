const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
});

const kharchSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  kid: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  clear: { type: Boolean, required: true, default: false },
});

module.exports = {
  userSchema,
  kharchSchema,
};
