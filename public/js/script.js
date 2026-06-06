const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const showLeaderboardBtn = document.getElementById("show-leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
const aiCategoryBtn = document.getElementById("ai-category-btn");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const tabButtons = document.querySelectorAll(".tab-btn");

let currentFilter = "monthly";
let allExpenses = [];

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

    const response = await axios.post("/api/expenses", expense, {
      headers: {
        Authorization: token,
      },
    });

    alert(response.data.message);

    expenseForm.reset();

    getExpenses();
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Failed to add expense");
  };
};

const renderExpenses = (expenses) => {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = `       <tr>         <td colspan="5" style="text-align:center;">
          No expenses found         </td>       </tr>
    `;
    return;
  }

  expenses.forEach((expense) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td>₹${expense.amount}</td>
  <td>${expense.description}</td>
  <td>${expense.category}</td>
  <td>${new Date(expense.date).toLocaleDateString()}</td>
  <td>
    <button
      class="delete-btn"
      data-id="${expense.id}"
    >
      Delete
    </button>
  </td>
`;

    tr.querySelector(".delete-btn").addEventListener("click", () => {
      deleteExpense(expense.id);
    });

    expenseList.appendChild(tr);
  });
};

const filterExpenses = () => {
  const today = new Date();

  let filteredExpenses = [];

  if (currentFilter === "daily") {
    filteredExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      return expenseDate.toDateString() === today.toDateString();
    });
  }

  if (currentFilter === "weekly") {
    filteredExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      const diffDays = (today - expenseDate) / (1000 * 60 * 60 * 24);

      return diffDays >= 0 && diffDays < 7;
    });
  }

  if (currentFilter === "monthly") {
    filteredExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      );
    });
  }

  renderExpenses(filteredExpenses);
};

const getExpenses = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("/api/expenses", {
      headers: {
        Authorization: token,
      },
    });

    allExpenses = response.data.expenses;

    filterExpenses();
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Failed to fetch expenses");
  }
};

const deleteExpense = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`/api/expenses/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    alert(response.data.message);

    getExpenses();
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Failed to delete expense");
  }
};

const showLeaderboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/leaderboard", {
      headers: {
        Authorization: token,
      },
    });

    const data = response.data.leaderboard;

    leaderboardList.innerHTML = "";

    data.forEach((user, index) => {
      const li = document.createElement("li");

      li.classList.add("leaderboard-item");

      li.innerHTML = `
    <span class="rank">#${index + 1}</span>

    <div class="leaderboard-info">
      <span class="name">${user.name}</span>
      <span class="expense">₹${user.totalExpense || 0}</span>
    </div>
  `;

      leaderboardList.appendChild(li);
    });
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Failed to fetch leaderboard");
  }
};

const suggestCategory = async () => {
  try {
    const description = descriptionInput.value.trim();

    if (!description) {
      return alert("Enter description first");
    }

    const response = await axios.post("/api/ai/categorize", {
      description,
    });

    categorySelect.value = response.data.category;
  } catch (error) {
    console.error(error);

    alert("Failed to get AI suggestion");
  }
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    filterExpenses();
  });
});

expenseForm.addEventListener("submit", addExpense);
showLeaderboardBtn.addEventListener("click", showLeaderboard);
aiCategoryBtn.addEventListener("click", suggestCategory);

window.addEventListener("DOMContentLoaded", getExpenses);
