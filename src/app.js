const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// Importing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// CORS configuration
const corsOpts = {
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

// Initialize Passport.js
app.use(passport.initialize());

// Parse incoming JSON data
app.use(express.json());

// Parse cookies sent in requests
app.use(cookieParser());

// Enable CORS
app.use(cors(corsOpts));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

module.exports = app;
