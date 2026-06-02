const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

// Configure axios to send token in headers
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

const addExpense = async (e) => {
  e.preventDefault();

  try {
    const expense = {
      amount: document.getElementById("amount").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      date: document.getElementById("date").value,
    };

    const response = await axios.post('/api/expenses/', expense);

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
  try {

    const response = await axios.get('/api/expenses/');

    const expenses = response.data.expenses;

    expenseList.innerHTML = "";

    expenses.forEach((expense) => {

      const li = document.createElement("li");

      li.innerHTML = `
        <strong>₹${expense.amount}</strong>
        - ${expense.description}
        - ${expense.category}
        - ${expense.date}
      `;

      expenseList.appendChild(li);
    });

  } catch (error) {
    console.error(error);
  }
};

expenseForm.addEventListener(
  "submit",
  addExpense
);

window.addEventListener(
  "DOMContentLoaded",
  getExpenses
);