const CATEGORY_COLORS = {
  Food:          { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  Transport:     { bg: "bg-blue-500/10",    text: "text-blue-400",    dot: "bg-blue-400"    },
  Shopping:      { bg: "bg-purple-500/10",  text: "text-purple-400",  dot: "bg-purple-400"  },
  Bills:         { bg: "bg-orange-500/10",  text: "text-orange-400",  dot: "bg-orange-400"  },
  Entertainment: { bg: "bg-pink-500/10",    text: "text-pink-400",    dot: "bg-pink-400"    },
  Other:         { bg: "bg-slate-500/10",   text: "text-slate-400",   dot: "bg-slate-400"   },
};

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

  return (
    <tr className="group animate-fade-in">
      {/* Title + notes */}
      <td className="px-4 py-3.5">
        <p className="font-medium text-slate-100 truncate max-w-[200px]">{expense.title}</p>
        {expense.notes && (
          <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{expense.notes}</p>
        )}
      </td>

      {/* Amount */}
      <td className="px-4 py-3.5">
        <span className="font-semibold text-white tabular-nums">
          {fmt.format(expense.amount)}
        </span>
      </td>

      {/* Category */}
      <td className="px-4 py-3.5">
        <span className={`badge ${color.bg} ${color.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
          {expense.category}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 text-slate-400 text-sm tabular-nums whitespace-nowrap">
        {new Date(expense.date + "T00:00:00").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Edit */}
          <button
            id={`edit-${expense.id}`}
            onClick={() => onEdit(expense)}
            className="btn-icon btn-ghost btn-sm text-slate-400 hover:text-brand-400"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            id={`delete-${expense.id}`}
            onClick={() => onDelete(expense.id)}
            className="btn-icon btn-danger btn-sm"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export { CATEGORY_COLORS };
