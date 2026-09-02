import { useState } from "react";
import { FileText, DollarSign, Tag, X, Check, AlertCircle } from "lucide-react";
import api from "../api";

function EditExpenseForm({ expense, onExpenseUpdated, onCancel }) {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category || "Other");
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
      const response = await api.patch(`/expenses/${expense.id}/`, {
        name: name.trim(),
        amount: Number(amount),
        category: category || "Other",
      });

      onExpenseUpdated(response.data);
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
          setError("Failed to update expense.");
        }
      } else {
        setError("Failed to update expense.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Expense</h3>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onCancel}
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="edit-name">Expense Name</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-amount">Amount ($)</label>
              <div className="input-with-icon">
                <DollarSign size={16} className="input-icon" />
                <input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-category">Category</label>
              <div className="input-with-icon">
                <Tag size={16} className="input-icon" />
                <select
                  id="edit-category"
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

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                <Check size={16} />
                <span>{submitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExpenseForm;
