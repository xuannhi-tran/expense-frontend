import { useState } from "react";
import { FileText, DollarSign, Tag, PlusCircle, AlertCircle } from "lucide-react";
import api from "../api";

function ExpenseForm({ onExpenseAdded }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide an expense name.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/expenses/", {
        name: name.trim(),
        amount: Number(amount),
        category: category || "Other",
      });

      onExpenseAdded(response.data);

      setName("");
      setAmount("");
      setCategory("Other");
    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        const errors = err.response.data;

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="expense-name">Expense Name</label>
        <div className="input-with-icon">
          <FileText size={16} className="input-icon" />
          <input
            id="expense-name"
            type="text"
            placeholder="e.g. Grocery shopping"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="expense-amount">Amount ($)</label>
        <div className="input-with-icon">
          <DollarSign size={16} className="input-icon" />
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="expense-category">Category</label>
        <div className="input-with-icon">
          <Tag size={16} className="input-icon" />
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
          >
            <option value="Food">Food & Dining</option>
            <option value="Transport">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities & Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="form-error-msg">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={submitting}>
        <PlusCircle size={17} />
        <span>{submitting ? "Adding..." : "Add Expense"}</span>
      </button>
    </form>
  );
}

export default ExpenseForm;
