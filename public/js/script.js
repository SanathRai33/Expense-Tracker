const BASE_URL = "http://localhost:3000/expenses";

let editExpenseId = null;

async function getExpenses() {
  try {
    const response = await axios.get(BASE_URL);
    const expenses = response?.data?.expenses;
    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");

      li.className =
        "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
      
        <div>
          <strong>₹${expense.amount}</strong>
          -
          ${expense.category}
          -
          ${expense.description}
        </div>
        <div>
          <button
            class="btn btn-warning btn-sm me-2"
            onclick="editExpense(
              ${expense.id},
              '${expense.amount}',
              '${expense.description}',
              '${expense.category}'
            )"
          >
            Edit
          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteExpense(${expense.id})"
          >
            Delete
          </button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.log(error);
  }
}

async function addExpense() {
  try {
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    if (!amount || !description) {
      alert("Please fill all fields");
      return;
    }

    const expense = { amount, description, category };

    if (editExpenseId) {
      await axios.put(`${BASE_URL}/${editExpenseId}`, expense);
      editExpenseId = null;
    } else {
      await axios.post(BASE_URL, expense);
    }
    clearInputs();
    getExpenses();
  } catch (error) {
    console.log(error);
  }
}

async function deleteExpense(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    getExpenses();
  } catch (error) {
    console.log(error);
  }
}

function editExpense(id, amount, description, category) {
  document.getElementById("amount").value = amount;
  document.getElementById("description").value = description;
  document.getElementById("category").value = category;
  editExpenseId = id;
}

function clearInputs() {
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
}

getExpenses();
