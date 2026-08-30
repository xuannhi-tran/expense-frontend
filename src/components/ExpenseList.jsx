function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>{expense.name}</p>
          <p>${expense.amount}</p>
          <p>{expense.category}</p>

          <button onClick={() => onEdit(expense)}>Edit</button>
          <button onClick={() => onDelete(expense.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
