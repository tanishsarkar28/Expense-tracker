import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Spending <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Visual overview of your expenses — monthly totals, trends, and category breakdown.
        </p>
      </div>

      <Dashboard />
    </div>
  );
}
