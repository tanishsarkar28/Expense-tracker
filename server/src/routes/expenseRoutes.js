const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getBudget,
  setBudget,
} = require("../controllers/expenseController");

// ─── Expense Routes ──────────────────────────────────────────────────────────
router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

// ─── Summary Route ───────────────────────────────────────────────────────────
router.get("/summary", getSummary);

// ─── Budget Routes ───────────────────────────────────────────────────────────
router.get("/budget", getBudget);
router.put("/budget", setBudget);

module.exports = router;
