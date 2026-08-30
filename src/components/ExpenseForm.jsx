import { useState } from "react";
import api from "../api";

function ExpenseForm({ onExpenseAdded }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/expenses/", {
        name,
        amount,
        category,
      });

      onExpenseAdded(response.data);

      setName("");
      setAmount("");
      setCategory("Other");
    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const errors = error.response.data;

        if (errors.name) {
          setError(errors.name[0]);
        } else if (errors.amount) {
          setError(errors.amount[0]);
        } else if (errors.category) {
          setError(errors.category[0]);
        } else {
          setError("Failed to add expense.");
        }
      } else {
        setError("Failed to add expense.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <input
        type="text"
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">Add Expense</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default ExpenseForm;
