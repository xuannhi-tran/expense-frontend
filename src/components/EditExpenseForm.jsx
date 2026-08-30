import { useState } from "react";
import api from "../api";

function EditExpenseForm({ expense, onExpenseUpdated, onCancel }) {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.patch(`/expenses/${expense.id}/`, {
        name,
        amount,
        category,
      });

      onExpenseUpdated(response.data);
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
          setError("Failed to update expense.");
        }
      } else {
        setError("Failed to update expense.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Expense</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default EditExpenseForm;
