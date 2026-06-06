const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/db-connection");
const { Sequelize } = require('sequelize')

const addExpense = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {

    const { amount, description, category, date } = req.body;
    const userId = req?.user?.id;

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId,
        date
      },
      {
        transaction,
      },
    );

    await User.update(
      {
        totalExpense: Sequelize.literal(`totalExpense + ${amount}`),
      },
      {
        where: { id: userId },
        transaction,
      },
    );

    await transaction.commit();

    res.status(201).json({
      message: "Expense Added",
      expense,
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({
      where: { userId },
    });

    // if (expenses.length === 0) {
    //   return res.status(404).json({
    //     message: "No expenses found",
    //     expenses: [],
    //   });
    // }

    res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id, {
      transaction,
    });

    if (!expense) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await expense.destroy({
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, description, category } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this expense" });
    }

    expense.amount = amount;
    expense.description = description;
    expense.category = category;

    const updatedExpense = await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
};
