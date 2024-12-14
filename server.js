if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {})
  .catch(() => {});
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.get("/user", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
app.listen(process.env.PORT, () => {});
