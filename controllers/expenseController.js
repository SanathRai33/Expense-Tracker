const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/db-connection");
const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

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
        date,
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

    logger.info(`Expense added by user ${userId}: Amount ${amount}, Category ${category}`);
    res.status(201).json({
      message: "Expense Added",
      expense,
    });
  } catch (error) {
    await transaction.rollback();

    logger.error(`Error adding expense for user ${req?.user?.id}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      expenses: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalExpenses: count,
    });
  } catch (error) {
    logger.error(`Get Expenses Error for user ${req.user.id}:`, error);
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

    logger.info(`Expense deleted: ID ${id} by user ${req.user.id}`);
    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();

    logger.error(`Error deleting expense ${req.params.id}:`, error);
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
      logger.warn(`Unauthorized update attempt for expense ${id} by user ${userId}`);
      return res
        .status(403)
        .json({ message: "Not authorized to update this expense" });
    }

    expense.amount = amount;
    expense.description = description;
    expense.category = category;

    const updatedExpense = await expense.save();

    logger.info(`Expense updated: ID ${id} by user ${userId}`);
    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    logger.error(`Error updating expense ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
};
