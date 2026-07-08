import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Filler
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { getSummary } from "../api/expenses";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler
);

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

const CATEGORY_PALETTE = [
  "#10b981", "#3d52ff", "#a855f7",
  "#f59e0b", "#ec4899", "#64748b",
];

const PIE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#94a3b8", padding: 16, font: { size: 12 } },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${fmt.format(ctx.parsed)}`,
      },
    },
  },
};

const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${fmt.format(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#64748b" },
      grid:  { color: "rgba(255,255,255,0.04)" },
    },
    y: {
      ticks: {
        color: "#64748b",
        callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`,
      },
      grid: { color: "rgba(255,255,255,0.04)" },
    },
  },
};

function StatCard({ label, value, sub, icon, gradient }) {
  return (
    <div className="card-sm flex items-start gap-4 animate-slide-up">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setError("Failed to load summary."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-400">{error}</div>
    );
  }

  const pieData = {
    labels: summary.categoryBreakdown.map((c) => c.category),
    datasets: [{
      data: summary.categoryBreakdown.map((c) => c.total),
      backgroundColor: CATEGORY_PALETTE.slice(0, summary.categoryBreakdown.length).map(
        (c) => c + "cc"
      ),
      borderColor: CATEGORY_PALETTE.slice(0, summary.categoryBreakdown.length),
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: summary.monthlyTrend.map((m) => m.month),
    datasets: [{
      label: "Spending",
      data: summary.monthlyTrend.map((m) => m.total),
      backgroundColor: "rgba(61,82,255,0.5)",
      borderColor: "#3d52ff",
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const topCategory = summary.categoryBreakdown.length
    ? summary.categoryBreakdown.reduce((a, b) => (a.total > b.total ? a : b))
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="This Month"
          value={fmt.format(summary.monthlyTotal)}
          sub="Current month spending"
          gradient="bg-gradient-brand opacity-80"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="This Week"
          value={fmt.format(summary.weeklyTotal)}
          sub="Current week spending"
          gradient="bg-gradient-success opacity-80"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="All Time Total"
          value={fmt.format(summary.totalAll)}
          sub={topCategory ? `Top: ${topCategory.category}` : "No expenses yet"}
          gradient="bg-purple-600/70"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pie — category breakdown */}
        <div className="card lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-4">Category Breakdown</h3>
          {summary.categoryBreakdown.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">No data yet.</p>
          ) : (
            <div style={{ height: 280 }}>
              <Pie data={pieData} options={PIE_OPTIONS} />
            </div>
          )}
        </div>

        {/* Bar — monthly trend */}
        <div className="card lg:col-span-3">
          <h3 className="text-base font-bold text-white mb-4">Monthly Spending Trend</h3>
          {summary.monthlyTrend.every((m) => m.total === 0) ? (
            <p className="text-slate-500 text-sm text-center py-12">No data yet.</p>
          ) : (
            <div style={{ height: 280 }}>
              <Bar data={barData} options={BAR_OPTIONS} />
            </div>
          )}
        </div>
      </div>

      {/* Category breakdown table */}
      {summary.categoryBreakdown.length > 0 && (
        <div className="card">
          <h3 className="text-base font-bold text-white mb-4">Category Summary</h3>
          <div className="space-y-3">
            {[...summary.categoryBreakdown]
              .sort((a, b) => b.total - a.total)
              .map((cat, i) => {
                const pct = summary.totalAll > 0
                  ? ((cat.total / summary.totalAll) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length] }}
                    />
                    <span className="text-sm text-slate-300 w-28 shrink-0">{cat.category}</span>
                    <div className="flex-1 progress-track">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-200 tabular-nums w-24 text-right">
                      {fmt.format(cat.total)}
                    </span>
                    <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
