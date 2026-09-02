import { Pencil, Trash2, ReceiptText } from "lucide-react";
import { getCategoryIcon } from "../utils/categories";

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-state-icon">
          <ReceiptText size={28} />
        </div>
        <h4 className="empty-state-title">No expenses found</h4>
        <p className="empty-state-desc">
          Add an expense or adjust your search filters to view your spending history.
        </p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => {
        const catClass = `cat-${expense.category || "Other"}`;

        return (
          <div className="expense-card" key={expense.id}>
            <div className="expense-left">
              <div className={`expense-cat-icon ${catClass}`}>
                {getCategoryIcon(expense.category, 20)}
              </div>
              <div className="expense-info">
                <h4 className="expense-name">{expense.name}</h4>
                <span className={`expense-cat-badge ${catClass}`}>
                  {expense.category}
                </span>
              </div>
            </div>

            <div className="expense-right">
              <span className="expense-amount">
                ${Number(expense.amount).toFixed(2)}
              </span>

              <div className="expense-actions">
                <button
                  type="button"
                  className="btn-action-icon"
                  title="Edit expense"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  className="btn-action-icon delete"
                  title="Delete expense"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
