require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("node:path");

const connectDB = require("./config/db");
const logger = require("./utils/logger");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Page routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signin.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/reset", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "reset.html"));
});

app.get("/password/resetpassword/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resetPassword.html"));
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/password", passwordRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.path}`, err);

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// Start server only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(`Server Running on Port ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();