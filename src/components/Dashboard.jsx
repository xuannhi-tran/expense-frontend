import { useEffect, useState } from "react";
import api from "../api";
import ExpenseList from "./ExpenseList";

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/");
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
  }, []);

  return (
    <div>
      <header>
        <h1>Expense Tracker</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main>
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
