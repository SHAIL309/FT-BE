if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const kharchRoutes = require("./routes/kharchRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {})
  .catch(() => {});

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", authMiddleware, userRoutes);
app.use("/kharch", authMiddleware, kharchRoutes);

app.listen(process.env.PORT, () => {});
