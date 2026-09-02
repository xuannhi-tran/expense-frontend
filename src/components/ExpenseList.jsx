import { Pencil, Trash2, ReceiptText, SearchX, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryIcon } from "../utils/categories";

function ExpenseList({
  expenses,
  allExpensesCount = 0,
  totalFilteredCount = 0,
  page = 1,
  hasPrevPage = false,
  hasNextPage = false,
  onPrevPage,
  onNextPage,
  onEdit,
  onRequestDelete,
  onOpenAdd,
  onClearFilters,
}) {
  // 1. Account has zero total expenses
  if (allExpensesCount === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-state-icon">
          <ReceiptText size={32} />
        </div>
        <h4 className="empty-state-title">No expenses logged yet</h4>
        <p className="empty-state-desc">
          Start building your personal spending record by recording your first transaction.
        </p>
        {onOpenAdd && (
          <button
            type="button"
            className="btn-primary empty-state-cta"
            onClick={onOpenAdd}
          >
            <Plus size={16} />
            <span>Add First Expense</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Filter / search yielded zero results
  if (expenses.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-state-icon">
          <SearchX size={32} />
        </div>
        <h4 className="empty-state-title">No matching expenses</h4>
        <p className="empty-state-desc">
          No transactions match your current search query or category filter.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className="btn-secondary empty-state-cta"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // Approximate total pages from backend count if available (assuming standard page size 10)
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));
  const showPagination = totalFilteredCount > pageSize || hasNextPage || hasPrevPage || page > 1;

  return (
    <div className="expense-list-container">
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
                    aria-label={`Edit ${expense.name}`}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    className="btn-action-icon delete"
                    title="Delete expense"
                    onClick={() => onRequestDelete(expense)}
                    aria-label={`Delete ${expense.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="pagination-bar" role="navigation" aria-label="Transaction Pagination">
          <button
            type="button"
            className="btn-pagination"
            onClick={onPrevPage}
            disabled={!hasPrevPage && page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span className="pagination-indicator">
            Page {page} {totalPages > 1 ? `of ${totalPages}` : ""}
          </span>

          <button
            type="button"
            className="btn-pagination"
            onClick={onNextPage}
            disabled={!hasNextPage && page >= totalPages}
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
