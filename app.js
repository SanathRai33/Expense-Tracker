require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./utils/db-connection");
const expenseRoutes = require("./routes/expenseRoutes");

require("./models/expenseModel");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/expenses", expenseRoutes);

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });