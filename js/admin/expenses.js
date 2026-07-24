const API_URL = "http://localhost:3000/api";

let allExpenses = [];
let currentTagFilter = "";
let editingExpenseId = null;

async function loadExpenses() {
  const res = await fetch(`${API_URL}/expenses`);
  allExpenses = await res.json();

  allExpenses.sort((a, b) =>
    new Date(b.createdAt || b.date) -
    new Date(a.createdAt || a.date)
  );

  filterExpenses();
}

function setTagFilter(tag, event) {
  currentTagFilter = tag;

  document.querySelectorAll(".tag-filter").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  filterExpenses();
}

function filterExpenses() {
  const selectedMonth = document.getElementById("expenseMonth").value;

  let filteredExpenses = allExpenses;

  if (selectedMonth) {
    filteredExpenses = filteredExpenses.filter(e =>
      e.date && e.date.startsWith(selectedMonth)
    );
  }

  if (currentTagFilter) {
    filteredExpenses = filteredExpenses.filter(e =>
      (e.tag || "").toLowerCase().trim() === currentTagFilter
    );
  }

  renderExpenses(filteredExpenses);
}

function showAllExpenses() {
  document.getElementById("expenseMonth").value = "";
  currentTagFilter = "";

  document.querySelectorAll(".tag-filter").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelector(".tag-filter").classList.add("active");

  renderExpenses(allExpenses);
}

function renderExpenses(expenses) {
  const box = document.getElementById("allExpenseList");
  box.innerHTML = "";

  if (expenses.length === 0) {
    box.innerHTML = `
      <div class="empty-sales">
        No expenses found 🧾
      </div>
    `;
    return;
  }

  expenses.forEach((e) => {
    const cost = parseFloat(e.cost) || 0;
    const amount = parseFloat(e.amount) || 0;
    const costPerUnit = amount > 0 ? cost / amount : 0;

    box.innerHTML += `
      <div class="list-item">
        <div>
          <strong>${e.name || "Unnamed Expense"}</strong>
          <p>
            ${e.date || "-"} · ${formatTagName(e.tag)} ·
            ${amount || "-"}${e.unit || ""} ·
            $${costPerUnit.toFixed(4)}/${e.unit || "unit"}
          </p>
        </div>

        <div class="expense-actions">
          <strong>$${cost.toFixed(2)}</strong>
          <button class="mini-edit" onclick='openEditModal(${JSON.stringify(e)})'>✏️</button>
        </div>
      </div>
    `;
  });
}

function openEditModal(expense) {
  editingExpenseId = expense._id;

  document.getElementById("editDate").value = expense.date || "";
  document.getElementById("editTag").value = (expense.tag || "others").toLowerCase().trim();
  document.getElementById("editName").value = expense.name || "";
  document.getElementById("editCost").value = expense.cost || "";
  document.getElementById("editAmount").value = expense.amount || "";
  document.getElementById("editUnit").value = expense.unit || "g";

  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  editingExpenseId = null;
  document.getElementById("editModal").classList.add("hidden");
}

async function saveEditedExpense() {
  if (!editingExpenseId) return;

  const updatedExpense = {
    date: document.getElementById("editDate").value,
    tag: document.getElementById("editTag").value,
    name: document.getElementById("editName").value,
    cost: parseFloat(document.getElementById("editCost").value),
    amount: parseFloat(document.getElementById("editAmount").value),
    unit: document.getElementById("editUnit").value
  };

  if (
    !updatedExpense.date ||
    !updatedExpense.tag ||
    !updatedExpense.name ||
    isNaN(updatedExpense.cost) ||
    isNaN(updatedExpense.amount)
  ) {
    alert("Please fill in all fields.");
    return;
  }

  await fetch(`${API_URL}/expenses/${editingExpenseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedExpense)
  });

  closeEditModal();
  loadExpenses();
}

function formatTagName(tag) {
  const tagMap = {
    salmon: "Salmon",
    crabstick: "Crabstick",
    kingoyster: "King Oyster Mushroom",
    buttonmushroom: "Button Mushroom",
    corn: "Corn",
    truffle: "Truffle",
    mozzarella: "Mozzarella",
    butter: "Butter",
    cookingcream: "Cooking Cream",
    chicken: "Chicken",
    egg: "Egg",
    tuna: "Tuna",
    cucumber: "Cucumber",
    mayo: "Mayo",
    soysauce: "Soy Sauce",
    teriyaki: "Teriyaki",
    mentaiko: "Mentaiko",
    rice: "Rice",
    vinegar: "Rice Vinegar",
    sugar: "Sugar",
    salt: "Salt",
    creamcheese: "Cream Cheese",
    cookingoil: "Cooking Oil",
    sesameoil: "Sesame Oil",
    flour: "Flour",
    blackpepper: "Black Pepper",
    edamame: "Edamame",
    yuzu: "Yuzu Syrup",
    bottle: "Bottle",
    bottlesticker: "Bottle Sticker",
    tray: "Tray",
    seaweed: "Seaweed",
    tea: "Tea",
    thermalbag: "Thermal Bag",
    logosticker: "Logo Sticker",
    namestickertray: "Name Sticker / Tray",
    receiptstickerbag: "Receipt Sticker / Bag",
    spoon: "Disposable Spoon",
    others: "Others"
  };

  const key = (tag || "others").toLowerCase().trim();
  return tagMap[key] || tag || "Others";
}

loadExpenses();