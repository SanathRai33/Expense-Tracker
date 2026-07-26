const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const { uploadToS3 } = require("../services/s3Service");
const logger = require("../utils/logger");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category, date, note } = req.body;

    const userId = req?.user?.id;

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      amount: numericAmount,
      description,
      category,
      date,
      note,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalExpense: numericAmount,
      },
    });

    logger.info(
      `Expense added by user ${userId}: Amount ${numericAmount}, Category ${category}`,
    );

    res.status(201).json({
      message: "Expense Added",
      expense,
    });
  } catch (error) {
    logger.error(`Error adding expense for user ${req?.user?.id}`, error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const [expenses, count] = await Promise.all([
      Expense.find({
        userId,
      })
        .sort({
          date: -1,
        })
        .skip(skip)
        .limit(limit),

      Expense.countDocuments({
        userId,
      }),
    ]);

    res.status(200).json({
      expenses,
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
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    // Also check ownership here.
    const expense = await Expense.findOne({
      _id: id,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalExpense: -expense.amount,
      },
    });

    logger.info(`Expense deleted: ID ${id} by user ${userId}`);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
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

    const { amount, description, category, date, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    if (expense.userId.toString() !== userId.toString()) {
      logger.warn(`Unauthorized update attempt for expense ${id} by user ${userId}`,);
      return res.status(403).json({
        message: "Not authorized to update this expense",
      });
    }

    const oldAmount = expense.amount;

    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0",
        });
      }

      expense.amount = numericAmount;
    }

    if (description !== undefined) {
      expense.description = description;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (date !== undefined) {
      expense.date = date;
    }

    if (note !== undefined) {
      expense.note = note;
    }

    const updatedExpense = await expense.save();

    const amountDifference = updatedExpense.amount - oldAmount;

    if (amountDifference !== 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          totalExpense: amountDifference,
        },
      });
    }

    logger.info(`Expense updated: ID ${id} by user ${userId}`);

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    logger.error(`Error updating expense ${req.params.id}:`, error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};

const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      userId,
    }).sort({
      date: -1,
    });

    const stringifiedExpenses = JSON.stringify(expenses, null, 2);

    const fileName = `expenses-${userId}-${Date.now()}.json`;

    const fileUrl = await uploadToS3(stringifiedExpenses, fileName);

    res.status(200).json({
      fileUrl,
      success: true,
    });
  } catch (error) {
    logger.error(`Download expenses error for user ${req?.user?.id}`, error);
    res.status(500).json({
      message: "Failed to download expenses",
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  downloadExpenses,
};
