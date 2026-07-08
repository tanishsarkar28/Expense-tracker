const { PrismaClient } = require("@prisma/client");
const { validateExpense, validateBudget } = require("../utils/validation");

const prisma = new PrismaClient();

// ─── EXPENSES ──────────────────────────────────────────────────────────────

/**
 * GET /api/expenses
 * Optional query params: category, from, to, sortBy (date|amount), order (asc|desc)
 */
async function getExpenses(req, res, next) {
  try {
    const { category, from, to, sortBy = "date", order = "desc" } = req.query;

    const where = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    const validSortFields = ["date", "amount", "createdAt"];
    const orderBy = validSortFields.includes(sortBy)
      ? { [sortBy]: order === "asc" ? "asc" : "desc" }
      : { date: "desc" };

    const expenses = await prisma.expense.findMany({ where, orderBy });
    res.json({ data: expenses, count: expenses.length });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/expenses
 */
async function createExpense(req, res, next) {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: true, messages: errors });
    }

    const { title, amount, category, date, notes } = req.body;
    const expense = await prisma.expense.create({
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        date,
        notes: notes ? notes.trim() : null,
      },
    });

    res.status(201).json({ data: expense });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/expenses/:id
 */
async function updateExpense(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: true, message: "Invalid expense ID." });
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: true, message: "Expense not found." });
    }

    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: true, messages: errors });
    }

    const { title, amount, category, date, notes } = req.body;
    const updated = await prisma.expense.update({
      where: { id },
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        date,
        notes: notes ? notes.trim() : null,
      },
    });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/expenses/:id
 */
async function deleteExpense(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: true, message: "Invalid expense ID." });
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: true, message: "Expense not found." });
    }

    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully." });
  } catch (err) {
    next(err);
  }
}

// ─── SUMMARY ───────────────────────────────────────────────────────────────

/**
 * GET /api/summary
 * Returns: monthlyTotal, weeklyTotal, categoryBreakdown, monthlyTrend
 */
async function getSummary(req, res, next) {
  try {
    const now = new Date();

    // Current month bounds
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`;

    // Current week bounds (Monday–Sunday)
    const dayOfWeek = now.getDay(); // 0=Sun
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const fmtDate = (d) => d.toISOString().split("T")[0];

    // All expenses this month
    const monthlyExpenses = await prisma.expense.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
    });

    // All expenses this week
    const weeklyExpenses = await prisma.expense.findMany({
      where: { date: { gte: fmtDate(weekStart), lte: fmtDate(weekEnd) } },
    });

    const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
    const weeklyTotal = weeklyExpenses.reduce((s, e) => s + e.amount, 0);

    // Category breakdown (all time for pie chart)
    const allExpenses = await prisma.expense.findMany();
    const categoryMap = {};
    allExpenses.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2)),
    }));

    // Monthly trend — last 6 months
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const start = `${yr}-${mo}-01`;
      const end = `${yr}-${mo}-31`;
      const expenses = await prisma.expense.findMany({
        where: { date: { gte: start, lte: end } },
      });
      const total = expenses.reduce((s, e) => s + e.amount, 0);
      monthlyTrend.push({ month: label, total: parseFloat(total.toFixed(2)) });
    }

    // Total overall
    const totalAll = allExpenses.reduce((s, e) => s + e.amount, 0);

    res.json({
      monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
      weeklyTotal: parseFloat(weeklyTotal.toFixed(2)),
      totalAll: parseFloat(totalAll.toFixed(2)),
      categoryBreakdown,
      monthlyTrend,
    });
  } catch (err) {
    next(err);
  }
}

// ─── BUDGET ────────────────────────────────────────────────────────────────

/**
 * GET /api/budget
 */
async function getBudget(req, res, next) {
  try {
    let budget = await prisma.budget.findFirst();
    if (!budget) {
      budget = await prisma.budget.create({ data: { monthlyLimit: 0 } });
    }
    res.json({ data: budget });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/budget
 */
async function setBudget(req, res, next) {
  try {
    const errors = validateBudget(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: true, messages: errors });
    }

    let budget = await prisma.budget.findFirst();
    if (!budget) {
      budget = await prisma.budget.create({
        data: { monthlyLimit: parseFloat(req.body.monthlyLimit) },
      });
    } else {
      budget = await prisma.budget.update({
        where: { id: budget.id },
        data: { monthlyLimit: parseFloat(req.body.monthlyLimit) },
      });
    }

    res.json({ data: budget });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getBudget,
  setBudget,
};
