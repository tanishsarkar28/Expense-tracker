import { useState } from "react";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import Filters from "../components/Filters";
import BudgetBar from "../components/BudgetBar";
import { createExpense, updateExpense } from "../api/expenses";

const defaultFilters = { category: "All", from: "", to: "", search: "" };

export default function HomePage() {
  const [showForm, setShowForm]   = useState(false);
  const [editData, setEditData]   = useState(null);
  const [filters, setFilters]     = useState(defaultFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAddClick = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditData(expense);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await updateExpense(editData.id, data);
    } else {
      await createExpense(data);
    }
    refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            My <span className="text-gradient">Expenses</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track, manage and filter all your spending.</p>
        </div>
        <button id="add-expense-btn" onClick={handleAddClick} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Budget bar */}
      <BudgetBar key={refreshKey} />

      {/* Filters */}
      <Filters filters={filters} onChange={setFilters} />

      {/* Expense list */}
      <ExpenseList
        filters={filters}
        onEdit={handleEdit}
        refreshKey={refreshKey}
      />

      {/* Modal form */}
      {showForm && (
        <ExpenseForm
          editData={editData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
