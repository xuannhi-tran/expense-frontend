import { useEffect, useState } from "react";
import api from "./api";
import Login from "./components/Login";
import { isAuthenticated, removeToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/");

      setExpenses(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchExpenses();
    }
  }, [loggedIn]);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setExpenses([]);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <h1>Expense Tracker</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Expenses</h2>

      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>
            {expense.name} - ${expense.amount} - {expense.category}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
