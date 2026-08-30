function ExpenseList({ expenses }) {
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
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
