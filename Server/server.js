const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize app
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Import Routes
const authRoutes = require("./Routes/authRoutes");
const carRoutes = require("./Routes/carRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const purchaseRoutes = require("./Routes/purchaseRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const supportRoutes = require("./Routes/supportRoutes");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/support", supportRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("RentX API is running successfully...");
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rentx";

mongoose
  .connect(MONGODB_URI, { dbName: "rentx" })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
