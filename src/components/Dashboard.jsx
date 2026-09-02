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
import DeleteConfirmModal from "./DeleteConfirmModal";
import CategoryDonutChart from "./CategoryDonutChart";
import SpendingTrendChart from "./SpendingTrendChart";
import { getCategoryIcon } from "../utils/categories";
import { getInitialTheme, applyTheme } from "../utils/theme";
import "../styles/dashboard.css";

/**
 * fetchAllExpenses
 * Iterates through all paginated backend pages to retrieve the complete unfiltered
 * expense dataset for overall dashboard KPIs, charts, and breakdown summaries.
 */
async function fetchAllExpenses() {
  let all = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await api.get("/expenses/", {
      params: { page: currentPage },
    });

    if (Array.isArray(response.data)) {
      all = response.data;
      hasMore = false;
    } else if (response.data && Array.isArray(response.data.results)) {
      all.push(...response.data.results);
      if (response.data.next) {
        currentPage += 1;
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  return all;
}

function Dashboard({ onLogout }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Unified Drawer state for Add & Edit
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerExpense, setDrawerExpense] = useState(null); // null = Add mode, object = Edit mode

  // Custom Delete Confirmation Modal state
  const [deleteModalExpense, setDeleteModalExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Apply theme on change & on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // 1. Fetch complete analytics dataset across all backend pages
  const fetchAnalytics = useCallback(async () => {
    try {
      const all = await fetchAllExpenses();
      setAllExpenses(all);
    } catch (err) {
      console.error("Failed to load overall analytics dataset:", err);
      setError("Failed to load spending overview. Please check your connection.");
    }
  }, []);

  // 2. Fetch paginated/filtered transactions for the list view only
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filteredResponse = await api.get("/expenses/", {
        params: {
          search: search || undefined,
          category: category || undefined,
          page: page > 1 ? page : undefined,
        },
      });

      if (filteredResponse.data && Array.isArray(filteredResponse.data.results)) {
        setExpenses(filteredResponse.data.results);
        setTotalFilteredCount(
          filteredResponse.data.count ?? filteredResponse.data.results.length
        );
        setHasNextPage(Boolean(filteredResponse.data.next));
        setHasPrevPage(Boolean(filteredResponse.data.previous));
      } else if (Array.isArray(filteredResponse.data)) {
        setExpenses(filteredResponse.data);
        setTotalFilteredCount(filteredResponse.data.length);
        setHasNextPage(false);
        setHasPrevPage(false);
      } else {
        setExpenses([]);
        setTotalFilteredCount(0);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Failed to load expenses. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  // Initial load: fetch overall analytics once
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Transaction list load: triggers on filter / search / page changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Combined refresh after CRUD operations
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchAnalytics(), fetchTransactions()]);
  }, [fetchAnalytics, fetchTransactions]);

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

  // Trigger custom delete modal
  const handleRequestDelete = (expense) => {
    setDeleteModalExpense(expense);
  };

  // Confirm Delete
  const handleConfirmDelete = async (expenseId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/expenses/${expenseId}/`);
      setDeleteModalExpense(null);
      await refreshAll();
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteModalExpense(null);
    }
  };

  // Pagination navigation handlers
  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  // Dashboard statistics calculations derived strictly from allExpenses (never mutated by filters or pagination)
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
              <span className="brand-version-badge">SPENDING HUB</span>
            </div>
            <div className="brand-status-indicator">
              <span className="brand-subtitle">Personal Spending Overview</span>
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
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="btn-logout"
            onClick={onLogout}
            aria-label="Log out of account"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Global Error Notice */}
      {error && (
        <div className="form-error-msg" style={{ marginBottom: 24 }} role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* 4-Card Overview Stats (Derived from all user expenses across all pages) */}
      <section className="dashboard-metrics" aria-label="Spending Summary Cards">
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
          {/* Expense Activity Curve (Only shown when data exists) */}
          {allExpenses.length > 0 && (
            <SpendingTrendChart allExpenses={allExpenses} />
          )}

          {/* Search & Category Filter */}
          <div className="search-filter-card">
            <div className="search-input-wrapper">
              <Search size={16} className="search-input-icon" />
              <input
                id="search-input"
                type="text"
                placeholder="Search expenses by title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                aria-label="Search expenses by title"
              />
            </div>

            <div className="filter-select-wrapper">
              <Filter size={15} className="filter-select-icon" />
              <select
                id="category-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter expenses by category"
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
                {totalFilteredCount} {totalFilteredCount === 1 ? "entry" : "entries"}
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
                  allExpensesCount={allExpenses.length}
                  totalFilteredCount={totalFilteredCount}
                  page={page}
                  hasPrevPage={hasPrevPage}
                  hasNextPage={hasNextPage}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                  onEdit={handleOpenEditDrawer}
                  onRequestDelete={handleRequestDelete}
                  onOpenAdd={handleOpenAddDrawer}
                  onClearFilters={() => {
                    setSearch("");
                    setCategory("");
                    setPage(1);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Category Breakdown (Cleanly aligned at top) */}
        <aside className="grid-sidebar">
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
                  <h4 className="empty-state-title" style={{ fontSize: 15, marginBottom: 4 }}>
                    No spending data yet
                  </h4>
                  <p className="empty-state-desc">
                    Add an expense to see your category breakdown.
                  </p>
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

      {/* Unified Add / Edit Expense Slide-Over Modal */}
      <ExpenseDrawer
        isOpen={isDrawerOpen}
        expense={drawerExpense}
        onClose={handleCloseDrawer}
        onSuccess={refreshAll}
      />

      {/* Custom Destructive Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteModalExpense)}
        expense={deleteModalExpense}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default Dashboard;
