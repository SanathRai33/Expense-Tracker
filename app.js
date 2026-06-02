require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("node:path");
const sequelize = require("./utils/db-connection");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signin.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

sequelize.sync()
.then(() => {
  app.listen(5000, () => {
    console.log("Server Running on Port 5000");
  });
})
.catch((err) => {
  console.error("Unable to connect to the database:", err);
});
