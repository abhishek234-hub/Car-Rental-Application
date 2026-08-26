const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { validateEmailConfig } = require("./utils/emailService");

// Initialize app
const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(",").map(url => url.trim());
  allowedOrigins.push(...urls);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                        origin.endsWith(".vercel.app") ||
                        origin.includes("localhost");
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
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

const mongooseOptions = {
  dbName: "rentA",
  maxPoolSize: 10,                 // Maintain up to 10 socket connections in pool
  serverSelectionTimeoutMS: 10000, // Keep trying to connect for 10 seconds
  socketTimeoutMS: 45000           // Close idle sockets after 45 seconds
};

// Start Express Server immediately so API endpoints are live instantly
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Connect to MongoDB asynchronously
mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    
    // Validate SMTP email settings in background
    validateEmailConfig().catch((err) => {
      console.error("⚠️ Email configuration validation failed:", err.message);
    });
  })
  .catch((err) => {
    console.error("⚠️ Initial database connection error:", err.message);
  });

// Handle connection status changes
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose connection disconnected! Attempting reconnect...");
});

// Graceful shutdown on process termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination (SIGINT).");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination (SIGTERM).");
  process.exit(0);
});
