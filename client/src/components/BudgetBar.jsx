import { useState, useEffect } from "react";
import { getBudget, setBudget, getSummary } from "../api/expenses";

export default function BudgetBar() {
  const [limit, setLimit]       = useState(0);
  const [spent, setSpent]       = useState(0);
  const [editing, setEditing]   = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);

  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

  useEffect(() => {
    const load = async () => {
      try {
        const [budgetRes, summaryRes] = await Promise.all([getBudget(), getSummary()]);
        setLimit(budgetRes.data?.monthlyLimit || 0);
        setSpent(summaryRes.monthlyTotal || 0);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isWarning = pct >= 80 && pct < 100;
  const isDanger  = pct >= 100;

  const barColor = isDanger
    ? "bg-gradient-danger"
    : isWarning
    ? "bg-gradient-warning"
    : "bg-gradient-brand";

  const handleSave = async () => {
    const val = parseFloat(inputVal);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    try {
      await setBudget(val);
      setLimit(val);
      setEditing(false);
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  if (loading) return null;

  return (
    <div className="card-sm animate-slide-down">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isDanger ? "bg-red-500/15" : isWarning ? "bg-amber-500/15" : "bg-brand-500/15"
          }`}>
            <svg className={`w-4 h-4 ${
              isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-brand-400"
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-200">Monthly Budget</span>
          {isDanger && (
            <span className="badge bg-red-500/10 text-red-400 text-xs">Over limit!</span>
          )}
          {isWarning && !isDanger && (
            <span className="badge bg-amber-500/10 text-amber-400 text-xs">Near limit</span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              id="budget-input"
              type="number"
              min="0"
              step="100"
              className="input py-1.5 px-3 text-sm w-32"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter limit"
              autoFocus
            />
            <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="btn-ghost btn-sm">Cancel</button>
          </div>
        ) : (
          <button
            id="set-budget-btn"
            onClick={() => { setInputVal(limit > 0 ? String(limit) : ""); setEditing(true); }}
            className="btn-ghost btn-sm text-xs"
          >
            {limit > 0 ? "Change" : "Set Budget"}
          </button>
        )}
      </div>

      {limit > 0 ? (
        <>
          <div className="progress-track mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Spent: <span className="text-slate-200 font-medium">{fmt.format(spent)}</span></span>
            <span>{pct.toFixed(0)}% of <span className="text-slate-200 font-medium">{fmt.format(limit)}</span></span>
          </div>
        </>
      ) : (
        <p className="text-xs text-slate-500 mt-1">No budget set. Click "Set Budget" to track your monthly limit.</p>
      )}
    </div>
  );
}
