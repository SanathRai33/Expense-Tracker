const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

const addExpense = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    const expense = {
      amount: document.getElementById("amount").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      date: document.getElementById("date").value,
    };

    const response = await axios.post(
      "/api/expenses",
      expense,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

    expenseForm.reset();

    getExpenses();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to add expense"
    );
  }
};

const getExpenses = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      "/api/expenses",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    expenseList.innerHTML = "";

    response.data.expenses.forEach((expense) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>₹${expense.amount}</strong>
        - ${expense.description}
        - ${expense.category}
        - ${new Date(expense.date).toLocaleDateString()}
      `;

      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to fetch expenses"
    );
  }
};

expenseForm.addEventListener("submit", addExpense);

window.addEventListener("DOMContentLoaded", getExpenses);