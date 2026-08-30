import { useEffect, useState } from "react";
import api from "../api";
import ExpenseList from "./ExpenseList";

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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

  return (
    <div>
      <header>
        <h1>Expense Tracker</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main>
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
        <h2>My Expenses</h2>

        {error && <p>{error}</p>}

        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <ExpenseList expenses={expenses} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
