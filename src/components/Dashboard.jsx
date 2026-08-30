import { useEffect, useState } from "react";
import api from "../api";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import EditExpenseForm from "./EditExpenseForm";

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/", {
        params: {
          search: search || undefined,
          category: category || undefined,
        },
      });

      setExpenses(response.data.results);
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

  const handleLogout = () => {
    // logout
  };
  // Handle Delete
  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}/`);

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error(error);
      setError("Failed to delete expense.");
    }
  };

  return (
    <div>
      <header>
        <h1>Expense Tracker</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main>
        <h2>My Expenses</h2>

        {error && <p>{error}</p>}

        {/* SEARCH + CATEGORY FILTER */}
        <div>
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

        {/* ADD EXPENSE */}
        <ExpenseForm
          onExpenseAdded={(newExpense) => {
            setExpenses((currentExpenses) => [newExpense, ...currentExpenses]);
          }}
        />

        {editingExpense && (
          <EditExpenseForm
            expense={editingExpense}
            onExpenseUpdated={(updatedExpense) => {
              setExpenses((currentExpenses) =>
                currentExpenses.map((expense) =>
                  expense.id === updatedExpense.id ? updatedExpense : expense
                )
              );

              setEditingExpense(null);
            }}
            onCancel={() => setEditingExpense(null)}
          />
        )}

        {/* EXPENSE LIST */}
        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
