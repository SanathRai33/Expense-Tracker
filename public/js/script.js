const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const showLeaderboardBtn = document.getElementById("show-leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
const aiCategoryBtn = document.getElementById("ai-category-btn");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");

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
  }
};

const getExpenses = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("/api/expenses", {
      headers: {
        Authorization: token,
      },
    });

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

    alert(error.response?.data?.message || "Failed to fetch expenses");
  }
};

const showLeaderboard = async () => {
  try {
    const response = await axios.get("/api/leaderboard");

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
    const description =
      descriptionInput.value.trim();

    if (!description) {
      return alert(
        "Enter description first"
      );
    }

    const response = await axios.post(
      "/api/ai/categorize",
      {
        description,
      }
    );

    categorySelect.value =
      response.data.category;
  } catch (error) {
    console.error(error);

    alert(
      "Failed to get AI suggestion"
    );
  }
};

expenseForm.addEventListener("submit", addExpense);
showLeaderboardBtn.addEventListener("click", showLeaderboard);
aiCategoryBtn.addEventListener("click", suggestCategory);

window.addEventListener("DOMContentLoaded", getExpenses);
