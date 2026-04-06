let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;

function getExpenses() {
    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach((exp, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <div>
                <strong>₹${exp.amount}</strong> - ${exp.category} - ${exp.description}
            </div>
            <div>
                <button class="btn btn-sm btn-warning me-2" onclick="editExpense(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addExpense() {
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    if (!amount || !description) {
        alert("Please fill all fields");
        return;
    }

    const expense = { amount, description, category };

    if (editIndex !== null) {
        expenses[editIndex] = expense;
        editIndex = null;
    } else {
        expenses.push(expense);
    }

    clearInputs();
    getExpenses();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    getExpenses();
}

function editExpense(index) {
    const exp = expenses[index];

    document.getElementById("amount").value = exp.amount;
    document.getElementById("description").value = exp.description;
    document.getElementById("category").value = exp.category;

    editIndex = index;
}

function clearInputs() {
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    
}

getExpenses();