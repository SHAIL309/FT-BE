if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use("/auth", authRoutes);
app.listen(process.env.PORT, () => console.log(`on Port:${process.env.PORT}`));
