function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="state-message">
        <h4>No expenses found</h4>
        <p>Add your first expense to start tracking your spending.</p>
      </div>
    );
  }
  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div className="expense-card" key={expense.id}>
          <div className="expense-info">
            <h4>{expense.name}</h4>
            <span className="expense-category">{expense.category}</span>
          </div>

          <div className="expense-right">
            <span className="expense-amount">
              ${Number(expense.amount).toFixed(2)}
            </span>

            <div className="expense-actions">
              <button onClick={() => onEdit(expense)}>Edit</button>

              <button onClick={() => onDelete(expense.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
