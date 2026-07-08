const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

export default function Filters({ filters, onChange }) {
  const handleChange = (field) => (e) => {
    onChange({ ...filters, [field]: e.target.value });
  };

  const handleClear = () => {
    onChange({ category: "All", from: "", to: "", search: "" });
  };

  const hasActive =
    filters.category !== "All" || filters.from || filters.to || filters.search;

  return (
    <div className="card-sm animate-slide-down">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[160px]">
          <label className="label">Search</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="filter-search"
              className="input pl-9"
              placeholder="Search expenses…"
              value={filters.search}
              onChange={handleChange("search")}
            />
          </div>
        </div>

        {/* Category */}
        <div className="min-w-[140px]">
          <label className="label">Category</label>
          <select
            id="filter-category"
            className="input"
            value={filters.category}
            onChange={handleChange("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* From date */}
        <div className="min-w-[140px]">
          <label className="label">From</label>
          <input
            id="filter-from"
            type="date"
            className="input"
            value={filters.from}
            onChange={handleChange("from")}
          />
        </div>

        {/* To date */}
        <div className="min-w-[140px]">
          <label className="label">To</label>
          <input
            id="filter-to"
            type="date"
            className="input"
            value={filters.to}
            onChange={handleChange("to")}
          />
        </div>

        {/* Clear */}
        {hasActive && (
          <button
            id="filter-clear"
            onClick={handleClear}
            className="btn-ghost btn text-xs gap-1.5 mb-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
