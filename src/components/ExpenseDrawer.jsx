import { useState, useEffect, useRef } from "react";
import {
  X,
  PlusCircle,
  Check,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "../api";
import { getCategoryIcon } from "../utils/categories";

const CATEGORIES = [
  { id: "Food", label: "Food & Dining" },
  { id: "Transport", label: "Transport" },
  { id: "Shopping", label: "Shopping" },
  { id: "Utilities", label: "Bills & Utilities" },
  { id: "Entertainment", label: "Entertainment" },
  { id: "Other", label: "Other" },
];

function ExpenseDrawer({ isOpen, expense, onClose, onSuccess }) {
  const isEditMode = Boolean(expense);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  // Sync state when drawer opens or expense changes
  useEffect(() => {
    if (isOpen) {
      if (expense) {
        setName(expense.name || "");
        setAmount(expense.amount ? String(expense.amount) : "");
        setCategory(expense.category || "Food");
      } else {
        setName("");
        setAmount("");
        setCategory("Food");
      }
      setError("");

      // Focus the first input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, expense]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a description or name for the expense.");
      return;
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than $0.00.");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        const response = await api.patch(`/expenses/${expense.id}/`, {
          name: name.trim(),
          amount: numAmount,
          category,
        });
        onSuccess(response.data);
      } else {
        const response = await api.post("/expenses/", {
          name: name.trim(),
          amount: numAmount,
          category,
        });
        onSuccess(response.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.name) setError(errors.name[0]);
        else if (errors.amount) setError(errors.amount[0]);
        else if (errors.category) setError(errors.category[0]);
        else setError(isEditMode ? "Failed to update expense." : "Failed to add expense.");
      } else {
        setError(isEditMode ? "Failed to update expense." : "Failed to add expense.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2 className="drawer-title">
              {isEditMode ? "Edit Expense" : "New Expense"}
            </h2>
            <p className="drawer-subtitle">
              {isEditMode
                ? "Update your transaction details below."
                : "Record a new transaction to track your spending."}
            </p>
          </div>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={onClose}
            title="Close drawer (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body Form */}
        <form className="drawer-form" onSubmit={handleSubmit}>
          <div className="drawer-body">
            {/* Amount Input */}
            <div className="form-group">
              <label htmlFor="drawer-amount">Amount</label>
              <div className="input-amount-container">
                <span className="amount-prefix">$</span>
                <input
                  id="drawer-amount"
                  ref={inputRef}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="input-amount-field"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Expense Name Input */}
            <div className="form-group">
              <label htmlFor="drawer-name">Description / Title</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  id="drawer-name"
                  type="text"
                  placeholder="e.g. Weekly Grocery Run, Uber ride..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Category Pill Selector */}
            <div className="form-group">
              <label>Select Category</label>
              <div className="category-pill-grid">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const catClass = `cat-${cat.id}`;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-pill-btn ${isSelected ? "selected " + catClass : ""}`}
                      onClick={() => setCategory(cat.id)}
                      disabled={submitting}
                    >
                      <span className={`category-pill-icon ${catClass}`}>
                        {getCategoryIcon(cat.id, 16)}
                      </span>
                      <span className="category-pill-label">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-error-msg">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="drawer-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isEditMode ? "Saving..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Check size={16} /> : <PlusCircle size={16} />}
                  <span>{isEditMode ? "Save Changes" : "Add Expense"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseDrawer;
