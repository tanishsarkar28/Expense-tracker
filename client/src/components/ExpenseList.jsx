import { useState, useEffect, useCallback } from "react";
import { getExpenses, deleteExpense } from "../api/expenses";
import ExpenseItem from "./ExpenseItem";

const SORT_OPTIONS = [
  { label: "Date ↓", sortBy: "date",   order: "desc" },
  { label: "Date ↑", sortBy: "date",   order: "asc"  },
  { label: "Amount ↓", sortBy: "amount", order: "desc" },
  { label: "Amount ↑", sortBy: "amount", order: "asc"  },
];

export default function ExpenseList({ filters, onEdit, refreshKey }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sortIdx, setSortIdx]   = useState(0);
  const [deleting, setDeleting] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = SORT_OPTIONS[sortIdx];
      const params = {
        sortBy: sort.sortBy,
        order:  sort.order,
        ...(filters.category !== "All" && { category: filters.category }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to   && { to:   filters.to   }),
      };
      const res = await getExpenses(params);
      let data = res.data || [];

      // Client-side text search
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase();
        data = data.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            (e.notes && e.notes.toLowerCase().includes(q))
        );
      }

      setExpenses(data);
    } catch {
      setError("Failed to load expenses. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortIdx, refreshKey]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeleting(id);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete expense.");
    } finally {
      setDeleting(null);
    }
  };

  const totalShown = expenses.reduce((s, e) => s + e.amount, 0);
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white">All Expenses</h2>
          {!loading && (
            <p className="text-xs text-slate-500 mt-0.5">
              {expenses.length} {expenses.length === 1 ? "record" : "records"} ·{" "}
              <span className="text-slate-400 font-medium">{fmt.format(totalShown)}</span> total
            </p>
          )}
        </div>

        {/* Sort selector */}
        <select
          id="sort-select"
          className="input w-auto text-sm py-2"
          value={sortIdx}
          onChange={(e) => setSortIdx(Number(e.target.value))}
        >
          {SORT_OPTIONS.map((o, i) => (
            <option key={i} value={i}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="spinner" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">{error}</p>
          <button onClick={fetchExpenses} className="btn-secondary btn-sm mt-3 mx-auto">Retry</button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && expenses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-slate-300 font-medium">No expenses found</p>
          <p className="text-slate-500 text-sm mt-1">Add your first expense or adjust your filters.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && expenses.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={{ ...expense, _deleting: deleting === expense.id }}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
