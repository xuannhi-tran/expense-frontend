import { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

function DeleteConfirmModal({ isOpen, expense, isDeleting, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !expense) return null;

  return (
    <div className="drawer-overlay delete-modal-overlay" onClick={onCancel}>
      <div
        className="delete-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="delete-modal-header">
          <div className="delete-icon-box">
            <AlertTriangle size={22} className="delete-warning-icon" />
          </div>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={onCancel}
            disabled={isDeleting}
            title="Close dialog (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <h3 id="delete-dialog-title" className="delete-modal-title">
            Delete Expense
          </h3>
          <p id="delete-dialog-desc" className="delete-modal-desc">
            Are you sure you want to delete{" "}
            <strong>&ldquo;{expense.name}&rdquo;</strong>{" "}
            ({expense.amount ? `$${Number(expense.amount).toFixed(2)}` : ""})? This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(expense.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Expense</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
