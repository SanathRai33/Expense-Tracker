const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  downloadExpenses,
} = require("../controllers/expenseController");

const auth = require("../middleware/auth");

router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.get("/download", auth, downloadExpenses);
router.delete("/:id", auth, deleteExpense);
router.put("/:id", auth, updateExpense);

module.exports = router;