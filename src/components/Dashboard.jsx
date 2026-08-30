import { useEffect, useState } from "react";

import api from "../api";

import ExpenseList from "./ExpenseList";

import ExpenseForm from "./ExpenseForm";

import EditExpenseForm from "./EditExpenseForm";

import "../styles/dashboard.css";

function Dashboard({ onLogout }) {
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
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

      setAllExpenses(allResponse.data.results);
      setExpenses(filteredResponse.data.results);
    } catch (error) {
      console.error(error);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [search, category]);

  // Handle Delete
  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}/`);

      await fetchExpenses();
    } catch (error) {
      console.error(error);
      setError("Failed to delete expense.");
    }
  };

  // Dashboard statistics use ALL expenses,
  // not the filtered search results.
  const totalSpent = allExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const categoryTotals = allExpenses.reduce((totals, expense) => {
    const expenseCategory = expense.category;
    const amount = Number(expense.amount);

    totals[expenseCategory] = (totals[expenseCategory] || 0) + amount;

    return totals;
  }, {});

  const expenseCount = allExpenses.length;

  const isFiltering = search || category;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Tracker</h1>

        <button onClick={onLogout}>Logout</button>
      </header>

      <main>
        <h2>My Expenses</h2>

        {/* Summary */}
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Spent</h3>

            <p>${totalSpent.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <h3>Total Expenses</h3>

            <p>{expenseCount}</p>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="dashboard-section">
          <h3>Spending by Category</h3>

          <div className="category-list">
            {Object.entries(categoryTotals).map(([expenseCategory, total]) => {
              const percentage =
                totalSpent > 0 ? (total / totalSpent) * 100 : 0;

              return (
                <div className="category-item" key={expenseCategory}>
                  <div className="category-header">
                    <span>{expenseCategory}</span>

                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="category-percentage">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="state-message error-state">
            <p>{error}</p>
          </div>
        )}

        {/* Search + Category Filter */}
        <div className="dashboard-filters">
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Expense Results */}
        <div className="dashboard-section">
          <h3>{isFiltering ? "Search Results" : "Recent Expenses"}</h3>

          {loading ? (
            <div className="state-message">
              <p>Loading expenses...</p>
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Edit Expense */}
        {editingExpense && (
          <div className="dashboard-section">
            <EditExpenseForm
              expense={editingExpense}
              onExpenseUpdated={async () => {
                setEditingExpense(null);

                await fetchExpenses();
              }}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        )}

        {/* Add Expense */}
        <div className="dashboard-section">
          <ExpenseForm
            onExpenseAdded={async () => {
              await fetchExpenses();
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
