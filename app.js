require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const sequelize = require("./utils/db-connection");
const logger = require("./utils/logger");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

require("./models");

const app = express();

app.use(cors());
app.use(express.json());

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

app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/password", passwordRoutes);

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.path}`, err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
    process.exit(1);
  });
