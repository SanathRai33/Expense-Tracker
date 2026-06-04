const { Sequelize } = require("sequelize");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const getLeaderboard = async (req, res) => {
  try {
    const result = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json({
      leaderboard: result,
      message: "Leaderboard fetched successfully",
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};
