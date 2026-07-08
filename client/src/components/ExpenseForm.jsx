import { useState, useEffect } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

const defaultForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function ExpenseForm({ onSubmit, onClose, editData }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        amount: editData.amount || "",
        category: editData.category || "Food",
        date: editData.date || new Date().toISOString().split("T")[0],
        notes: editData.notes || "",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      e.amount = "Enter a valid amount greater than 0.";
    if (!form.date) e.date = "Date is required.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) });
      setForm(defaultForm);
      onClose();
    } catch (err) {
      console.error("Submit error:", err?.response?.status, err?.response?.data, err?.message);
      const serverMsg =
        err?.response?.data?.messages?.join(" ") ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        null;
      const status = err?.response?.status;
      const fallback = status
        ? `Error ${status}: ${serverMsg || err.message}`
        : `Network error — ${err.message}. Is the backend running?`;
      setErrors({ global: serverMsg || fallback });
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editData ? "Edit Expense" : "Add New Expense"}
          </h2>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.global && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">Title *</label>
            <input
              id="expense-title"
              className={`input ${errors.title ? "input-error" : ""}`}
              placeholder="e.g. Grocery run"
              value={form.title}
              onChange={handleChange("title")}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Amount + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount (₹) *</label>
              <input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                className={`input ${errors.amount ? "input-error" : ""}`}
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange("amount")}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
            </div>
            <div>
              <label className="label">Category *</label>
              <select
                id="expense-category"
                className="input"
                value={form.category}
                onChange={handleChange("category")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date *</label>
            <input
              id="expense-date"
              type="date"
              className={`input ${errors.date ? "input-error" : ""}`}
              value={form.date}
              onChange={handleChange("date")}
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              id="expense-notes"
              rows={3}
              className="input resize-none"
              placeholder="Any additional details..."
              value={form.notes}
              onChange={handleChange("notes")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : editData ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
