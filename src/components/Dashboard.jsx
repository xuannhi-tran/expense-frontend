import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  Receipt,
  TrendingUp,
  Calculator,
  Search,
  Filter,
  Plus,
  PieChart,
  LogOut,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import api from "../api";
import ExpenseList from "./ExpenseList";
import ExpenseDrawer from "./ExpenseDrawer";
import CategoryDonutChart from "./CategoryDonutChart";
import SpendingTrendChart from "./SpendingTrendChart";
import { getCategoryIcon } from "../utils/categories";
import { getInitialTheme, applyTheme } from "../utils/theme";
import "../styles/dashboard.css";

function Dashboard({ onLogout }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Unified Drawer state for Add & Edit
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerExpense, setDrawerExpense] = useState(null); // null = Add mode, object = Edit mode

  // Apply theme on change & on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all expenses for dashboard statistics
      const allResponse = await api.get("/expenses/");

      // Fetch filtered expenses for search results
      const filteredResponse = await api.get("/expenses/", {
        params: {
          search: search || undefined,
          category: category || undefined,
        },
      });

      setAllExpenses(allResponse.data.results || allResponse.data || []);
      setExpenses(filteredResponse.data.results || filteredResponse.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Open Drawer in Add mode
  const handleOpenAddDrawer = () => {
    setDrawerExpense(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer in Edit mode
  const handleOpenEditDrawer = (expense) => {
    setDrawerExpense(expense);
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerExpense(null);
  };

  // Handle Delete
  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}/`);
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense.");
    }
  };

  // Dashboard statistics calculations
  const totalSpent = allExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const expenseCount = allExpenses.length;

  const categoryTotals = allExpenses.reduce((totals, expense) => {
    const expenseCategory = expense.category || "Other";
    const amount = Number(expense.amount || 0);
    totals[expenseCategory] = (totals[expenseCategory] || 0) + amount;
    return totals;
  }, {});

  // Find Top Category
  const topCategoryEntry = Object.entries(categoryTotals).reduce(
    (max, curr) => (curr[1] > (max[1] || 0) ? curr : max),
    ["None", 0]
  );
  const topCategory = topCategoryEntry[0];

  const averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;

  const isFiltering = Boolean(search || category);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="brand-logo-container">
            <div className="brand-logo-glow" />
            <div className="brand-logo">
              <Sparkles size={21} className="brand-icon" />
            </div>
          </div>
          <div className="brand-text-group">
            <div className="brand-title-row">
              <h1 className="brand-title">Expense Tracker</h1>
              <span className="brand-version-badge">Live Hub</span>
            </div>
            <div className="brand-status-indicator">
              <span className="status-dot-ping" />
              <span className="brand-subtitle">Real-time Financial & Spending Insights</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-header-add"
            onClick={handleOpenAddDrawer}
          >
            <Plus size={17} />
            <span>New Expense</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button type="button" className="btn-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Global Error Notice */}
      {error && (
        <div className="form-error-msg" style={{ marginBottom: 24 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* 4-Card Overview Stats */}
      <section className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon-box total">
            <Wallet size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Spent</span>
            <span className="metric-value">${totalSpent.toFixed(2)}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box count">
            <Receipt size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Transactions</span>
            <span className="metric-value">{expenseCount}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box top">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Top Category</span>
            <span className="metric-value">{topCategory}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box avg">
            <Calculator size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Average Cost</span>
            <span className="metric-value">${averageExpense.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* 2-Column Responsive Main Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Charts, Search/Filter & Expense List */}
        <div className="grid-main-content">
          {/* Spending Trend Analytics Chart */}
          {allExpenses.length > 0 && (
            <SpendingTrendChart
              allExpenses={allExpenses}
            />
          )}

          {/* Search & Category Filter */}
          <div className="search-filter-card">
            <div className="search-input-wrapper">
              <Search size={16} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search expenses by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select-wrapper">
              <Filter size={15} className="filter-select-icon" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Food">Food & Dining</option>
                <option value="Transport">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities & Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Transaction History Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title">
                <Receipt size={18} />
                <span>{isFiltering ? "Filtered Expenses" : "Recent Transactions"}</span>
              </h2>
              <span className="card-badge">
                {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="loading-skeleton">
                  <div className="skeleton-item" />
                  <div className="skeleton-item" />
                  <div className="skeleton-item" />
                </div>
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onEdit={handleOpenEditDrawer}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action Banner & Category Breakdown */}
        <aside className="grid-sidebar">
          {/* Quick Action / Summary Banner */}
          <div className="sidebar-summary-card">
            <h3 className="sidebar-summary-title">
              <Sparkles size={18} />
              <span>Quick Actions</span>
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.85, lineHeight: 1.4 }}>
              Track a new purchase or update your spending log in seconds.
            </p>
            <button
              type="button"
              className="sidebar-summary-btn"
              onClick={handleOpenAddDrawer}
            >
              <Plus size={17} />
              <span>Add New Expense</span>
            </button>
          </div>

          {/* Spending by Category Card (with Donut Chart) */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title">
                <PieChart size={18} />
                <span>Category Breakdown</span>
              </h2>
            </div>
            <div className="card-body">
              {Object.keys(categoryTotals).length === 0 ? (
                <div className="empty-state-box" style={{ padding: "24px 16px" }}>
                  <p className="empty-state-desc">No category data yet.</p>
                </div>
              ) : (
                <>
                  {/* Interactive Donut Chart */}
                  <CategoryDonutChart
                    categoryTotals={categoryTotals}
                    totalSpent={totalSpent}
                  />

                  {/* Category Progress Bars */}
                  <div className="category-breakdown-list" style={{ marginTop: 18 }}>
                    {Object.entries(categoryTotals).map(([catName, total]) => {
                      const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
                      const catClass = `cat-${catName}`;
                      const barClass = `cat-bar-${catName}`;

                      return (
                        <div className="category-breakdown-item" key={catName}>
                          <div className="category-breakdown-header">
                            <span className="category-breakdown-label">
                              <span className={`category-icon-sm ${catClass}`}>
                                {getCategoryIcon(catName, 14)}
                              </span>
                              {catName}
                            </span>
                            <span className="category-breakdown-amount">
                              ${total.toFixed(2)}
                            </span>
                          </div>

                          <div className="category-bar-bg">
                            <div
                              className={`category-bar-progress ${barClass}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>

                          <div className="category-breakdown-footer">
                            <span className="category-percentage-text">
                              {percentage.toFixed(1)}% of total
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Unified Add / Edit Expense Slide-Over Drawer */}
      <ExpenseDrawer
        isOpen={isDrawerOpen}
        expense={drawerExpense}
        onClose={handleCloseDrawer}
        onSuccess={async () => {
          await fetchExpenses();
        }}
      />
    </div>
  );
}

export default Dashboard;
