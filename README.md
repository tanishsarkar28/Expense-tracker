# 💸 Expense Tracker

A full-stack web app to track personal expenses, set monthly budgets, and visualise spending with charts.

---

## 🗂 Folder Structure

```
Expense Tracker/
├── client/                  # React + Vite + Tailwind CSS frontend
│   └── src/
│       ├── api/             # Axios API call functions
│       ├── components/      # Reusable UI components
│       └── pages/           # Page-level components
└── server/                  # Node.js + Express backend
    ├── prisma/              # Database schema and SQLite file
    └── src/
        ├── controllers/     # Business logic
        ├── middleware/      # Error handling
        ├── routes/          # API route definitions
        └── utils/           # Validation helpers
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Install backend dependencies
```bash
cd server
npm install
```

### 2. Run the database migration (creates SQLite file)
```bash
npx prisma migrate dev --name init
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install
```

### 4. Start both servers (in separate terminals)
```bash
# Terminal 1 – backend (runs on port 3001)
cd server
npm run dev

# Terminal 2 – frontend (runs on port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses (supports `?category`, `?from`, `?to`, `?sortBy`, `?order`) |
| POST | `/api/expenses` | Create a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/summary` | Get totals + chart data |
| GET | `/api/budget` | Get the monthly budget |
| PUT | `/api/budget` | Set the monthly budget |

---

## ✨ Features Explained

### 1. Add / Edit Expense
- Click **Add Expense** button on the home page.
- Fill in title, amount, category (dropdown), date and optional notes.
- Client-side and server-side validation (no negative amounts, required fields).
- Click ✏️ on any row to edit it inline in the same modal.

### 2. View & Sort Expenses
- All expenses are shown in a sortable table.
- Use the **Sort** dropdown to order by date or amount (ascending/descending).
- Each row shows category badge (colour-coded) and hover-reveal edit/delete buttons.

### 3. Filter & Search
- **Search** box: filters by title or notes (client-side, instant).
- **Category** dropdown: sends a server-side filter query.
- **From / To** date pickers: sends a date-range filter to the server.
- **Clear** button appears when any filter is active.

### 4. Dashboard (Charts)
- Navigate to **Dashboard** via the top navbar.
- **This Month** — total spent in the current calendar month.
- **This Week** — total spent since Monday.
- **All Time** — total of every expense.
- **Pie chart** — category-wise breakdown (Chart.js).
- **Bar chart** — last 6 months spending trend (Chart.js).
- **Category summary** — horizontal bar rows with % of total.

### 5. Monthly Budget
- Click **Set Budget** in the budget bar on the Home page.
- Budget is saved to the database and persists across sessions.
- Progress bar turns **amber** at 80% and **red** at 100%.

---

## 🏗 Architecture Decisions

| Decision | Reason |
|----------|--------|
| **SQLite + Prisma** | Zero setup — one file database. Prisma gives type-safe queries. |
| **Vite proxy** | `/api` requests are proxied to `localhost:3001`, so no CORS config needed on the frontend. |
| **React Router** | Two routes: `/` (Home) and `/dashboard` for clear separation. |
| **Chart.js + react-chartjs-2** | Lightweight, well-documented, easy to integrate with React. |
| **Tailwind CSS** | Utility-first CSS for rapid, consistent dark-mode UI. |

---

## 📁 Key Files Summary

### Backend
| File | Purpose |
|------|---------|
| `server/index.js` | Express app entry — sets up middleware and mounts routes |
| `server/prisma/schema.prisma` | Database schema — `Expense` and `Budget` models |
| `server/src/routes/expenseRoutes.js` | Maps URL paths to controller functions |
| `server/src/controllers/expenseController.js` | All business logic — CRUD + summary calculations |
| `server/src/utils/validation.js` | Input validation (required fields, positive amounts) |
| `server/src/middleware/errorHandler.js` | Global error handler → JSON error responses |

### Frontend
| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Root — React Router with Navbar + two pages |
| `client/src/api/expenses.js` | Axios wrappers for every API endpoint |
| `client/src/components/Navbar.jsx` | Sticky top nav with active link highlighting |
| `client/src/components/ExpenseForm.jsx` | Add/edit modal form with validation |
| `client/src/components/ExpenseList.jsx` | Sortable table with loading/empty states |
| `client/src/components/ExpenseItem.jsx` | Single table row — category badge + action buttons |
| `client/src/components/Filters.jsx` | Search, category, date-range filter bar |
| `client/src/components/Dashboard.jsx` | Stat cards + pie + bar charts |
| `client/src/components/BudgetBar.jsx` | Monthly budget progress bar with inline editing |
| `client/src/pages/HomePage.jsx` | Composes list + filters + form + budget bar |
| `client/src/pages/DashboardPage.jsx` | Renders Dashboard component with page header |
