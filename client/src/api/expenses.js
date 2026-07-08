import axios from "axios";

// In development: Vite proxies /api → localhost:3001 (no CORS needed)
// In production:  VITE_API_URL is set to the Railway backend URL
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ─── Expenses ──────────────────────────────────────────────────────────────

/** Fetch all expenses with optional filters */
export const getExpenses = (params = {}) =>
  api.get("/expenses", { params }).then((r) => r.data);

/** Create a new expense */
export const createExpense = (data) =>
  api.post("/expenses", data).then((r) => r.data);

/** Update an existing expense by id */
export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data).then((r) => r.data);

/** Delete an expense by id */
export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`).then((r) => r.data);

// ─── Summary ───────────────────────────────────────────────────────────────

/** Fetch dashboard summary (totals, chart data) */
export const getSummary = () =>
  api.get("/summary").then((r) => r.data);

// ─── Budget ────────────────────────────────────────────────────────────────

/** Fetch the current monthly budget */
export const getBudget = () =>
  api.get("/budget").then((r) => r.data);

/** Update the monthly budget */
export const setBudget = (monthlyLimit) =>
  api.put("/budget", { monthlyLimit }).then((r) => r.data);
