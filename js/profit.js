const API_URL = "http://localhost:3000/api";

let expenses = [];
let sales = [];

const deliveryFees = {
  north: 8,
  west: 12,
  northeast: 12,
  central: 15,
  east: 15,
};

function getCost(tag) {
  const costPerUnit = getCostPerUnit();
  return costPerUnit[tag] || 0;
}

// Estimate cost per tray recipe
function getPackagingCost() {
  const c = getCost;

  return (
    c("tray") * 1 +
    c("furikake") * 2 +
    c("seaweed") * 1 +
    c("logosticker") * 1 +
    c("namestickertray") * 1 +
    c("receiptstickerbag") * 1 +
    c("spoon") * 1
  );
}

function getRiceCost() {
  const c = getCost;

  return 90 * c("rice") + 5 * c("vinegar") + 2.5 * c("sugar") + 1 * c("salt");
}

function getSalmonCost() {
  const c = getCost;

  return (
    55 * c("salmon") +
    30 * c("crabstick") +
    22.5 * c("mayo") +
    10 * c("mentaiko") +
    2.5 * c("creamcheese") +
    10 * c("mentaiko") +
    getRiceCost() +
    getPackagingCost()
  );
}

function getShroomCost() {
  const c = getCost;

  return (
    50 * c("kingoyster") +
    70 * c("buttonmushroom") +
    50 * c("corn") +
    5 * c("truffle") +
    30 * c("mayo") +
    15 * c("creamcheese") +
    5 * c("cookingcream") +
    15 * c("mozzarella") +
    getRiceCost() +
    getPackagingCost()
  );
}

function getChickenCost() {
  const c = getCost;

  return (
    110 * c("chicken") +
    8 * c("flour") +
    2 * c("sesameoil") +
    40 * c("teriyaki") +
    20 * c("mayo") +
    1 * c("egg") +
    getRiceCost() +
    getPackagingCost()
  );
}

function getTunaCost() {
  const c = getCost;

  return (
    75 * c("tuna") +
    15 * c("mayo") +
    10 * c("creamcheese") +
    2.5 * c("soysauce") +
    1.25 * c("sugar") +
    1.25 * c("sesameoil") +
    30 * c("cucumber") +
    10 * c("mayo") +
    getRiceCost() +
    getPackagingCost()
  );
}

function getLuncheonCost() {
  const c = getCost;

  return (
    100 * c("luncheon") +
    15 * c("mayo") +
    1 * c("egg") +
    getRiceCost() +
    getPackagingCost()
  );
}

function getSeaweedCost() {
  const c = getCost;
  return 1 * c("seaweed");
}

function getTeaCost() {
  const c = getCost;
  return 1 * c("tea");
}

function getProductCost(item) {
  if (item === "salmon") return getSalmonCost();
  if (item === "shroom") return getShroomCost();
  if (item === "chicken") return getChickenCost();
  if (item === "tuna") return getTunaCost();
  if (item === "luncheon") return getLuncheonCost();

  if (item === "seaweed") return getSeaweedCost();
  if (item === "tea") return getTeaCost();
  return 0;
}

function updateProductCostPreview() {
  document.getElementById("tunaCostPreview").textContent = money(getTunaCost());
  document.getElementById("salmonCostPreview").textContent =
    money(getSalmonCost());
  document.getElementById("chickenCostPreview").textContent =
    money(getChickenCost());
  document.getElementById("shroomCostPreview").textContent =
    money(getShroomCost());
  document.getElementById("luncheonCostPreview").textContent =
    money(getLuncheonCost());
}

window.onload = function () {
  const today = new Date();
  const month = today.toISOString().slice(0, 7);

  document.getElementById("summaryMonth").value = month;
  document.getElementById("expenseDate").valueAsDate = today;
  document.getElementById("saleDate").valueAsDate = today;

  loadExpenses();
  loadSales();
};

document
  .getElementById("summaryMonth")
  .addEventListener("change", calculateSummary);

async function loadExpenses() {
  const res = await fetch(`${API_URL}/expenses`);
  expenses = await res.json();
  renderExpenses();
  calculateSummary();
}

async function loadSales() {
  const res = await fetch(`${API_URL}/orders`);
  sales = await res.json();
  renderSales();
  calculateSummary();
}

async function addExpense() {
  const date = document.getElementById("expenseDate").value;
  const tag = document.getElementById("expenseTag").value;
  const name = document.getElementById("expenseName").value;
  const cost = parseFloat(document.getElementById("expenseCost").value);
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const unit = document.getElementById("expenseUnit").value;

  if (!date || !tag || !name || isNaN(cost) || isNaN(amount)) {
    alert("Please fill in date, tag, item name, cost and amount.");
    return;
  }

  await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      tag,
      name,
      cost,
      amount,
      unit,
      createdAt: new Date().toISOString(),
    }),
  });

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseCost").value = "";
  document.getElementById("expenseAmount").value = "";

  loadExpenses();
}

async function addSale() {
  const customerName = document.getElementById("customerName").value || "Guest";
  const date = document.getElementById("saleDate").value;

  const qtyTuna = parseInt(document.getElementById("qtyTuna").value) || 0;
  const qtySalmon = parseInt(document.getElementById("qtySalmon").value) || 0;
  const qtyChicken = parseInt(document.getElementById("qtyChicken").value) || 0;
  const qtyShroom = parseInt(document.getElementById("qtyShroom").value) || 0;
  const qtyLuncheon =
    parseInt(document.getElementById("qtyLuncheon").value) || 0;
  const qtySeaweed = parseInt(document.getElementById("qtySeaweed").value) || 0;
  const qtyTea = parseInt(document.getElementById("qtyTea").value) || 0;

  const priceTuna = parseFloat(document.getElementById("priceTuna").value) || 0;
  const priceSalmon =
    parseFloat(document.getElementById("priceSalmon").value) || 0;
  const priceChicken =
    parseFloat(document.getElementById("priceChicken").value) || 0;
  const priceShroom =
    parseFloat(document.getElementById("priceShroom").value) || 0;
  const priceLuncheon =
    parseFloat(document.getElementById("priceLuncheon").value) || 0;
  const priceSeaweed =
    parseFloat(document.getElementById("priceSeaweed").value) || 0;
  const priceTea = parseFloat(document.getElementById("priceTea").value) || 0;

  const qtyTrio = parseInt(document.getElementById("qtyTrio").value) || 0;
  const priceTrio = parseFloat(document.getElementById("priceTrio").value) || 0;

  const trioSalmon = parseInt(document.getElementById("trioSalmon").value) || 0;
  const trioShroom = parseInt(document.getElementById("trioShroom").value) || 0;
  const trioChicken =
    parseInt(document.getElementById("trioChicken").value) || 0;
  const trioTuna = parseInt(document.getElementById("trioTuna").value) || 0;

  const trioFlavourTotal = trioSalmon + trioShroom + trioChicken + trioTuna;

  if (trioFlavourTotal !== qtyTrio * 3) {
    alert("Trio flavour total must equal WAYAKI Trio Qty × 3.");
    return;
  }

  const method = document.getElementById("collectionMethod").value;

  let customerDeliveryPaid = 0;
  let driverPaid = 0;

  if (method === "delivery") {
    customerDeliveryPaid =
      parseFloat(document.getElementById("customerDeliveryPaid").value) || 0;
    driverPaid = parseFloat(document.getElementById("driverPaid").value) || 0;
  }

  if (
    !date ||
    qtyTuna +
      qtySalmon +
      qtyChicken +
      qtyShroom +
      qtyLuncheon +
      qtyTrio +
      qtySeaweed +
      qtyTea ===
      0
  ) {
    alert("Please enter date and at least 1 item.");
    return;
  }

  await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      customerName,
      createdAt: new Date().toISOString(),
      items: {
        trio: {
          qty: qtyTrio,
          price: priceTrio,
          flavours: {
            salmon: trioSalmon,
            shroom: trioShroom,
            chicken: trioChicken,
            tuna: trioTuna,
          },
        },

        salmon: { qty: qtySalmon, price: priceSalmon },
        shroom: { qty: qtyShroom, price: priceShroom },
        chicken: { qty: qtyChicken, price: priceChicken },
        tuna: { qty: qtyTuna, price: priceTuna },
        luncheon: { qty: qtyLuncheon, price: priceLuncheon },

        seaweed: { qty: qtySeaweed, price: priceSeaweed },
        tea: { qty: qtyTea, price: priceTea },
      },
      method,
      customerDeliveryPaid,
      driverPaid,
    }),
  });

  document.getElementById("customerName").value = "";
  document.getElementById("qtyTrio").value = 0;
  document.getElementById("trioSalmon").value = 0;
  document.getElementById("trioShroom").value = 0;
  document.getElementById("trioChicken").value = 0;
  document.getElementById("trioTuna").value = 0;

  document.getElementById("qtySalmon").value = 0;
  document.getElementById("qtyShroom").value = 0;
  document.getElementById("qtyChicken").value = 0;
  document.getElementById("qtyTuna").value = 0;
  document.getElementById("qtyLuncheon").value = 0;

  document.getElementById("qtySeaweed").value = 0;
  document.getElementById("qtyTea").value = 0;

  document.getElementById("customerDeliveryPaid").value = 0;
  document.getElementById("driverPaid").value = 0;

  loadSales();
}

function getCostPerUnit() {
  const totalCost = {};
  const totalAmount = {};

  expenses.forEach((e) => {
    const tag = (e.tag || "").toLowerCase().trim();
    const amount = parseFloat(e.amount);
    const cost = parseFloat(e.cost);

    if (!tag || !amount || !cost) return;

    totalCost[tag] = (totalCost[tag] || 0) + cost;
    totalAmount[tag] = (totalAmount[tag] || 0) + amount;
  });

  const costMap = {};

  Object.keys(totalCost).forEach((tag) => {
    costMap[tag] = totalCost[tag] / totalAmount[tag];
  });

  return costMap;
}

function renderExpenses() {
  const box = document.getElementById("expenseList");
  box.innerHTML = "";

  expenses.sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );

  expenses.slice(0, 5).forEach((e, index) => {
    const costPerUnit = e.amount > 0 ? e.cost / e.amount : 0;

    box.innerHTML += `
        <div class="list-item">
          <div>
            <strong>${e.name}</strong>
            <p>
              ${e.date} · ${e.tag || "others"} · 
              ${e.amount || "-"}${e.unit || ""} · 
              $${costPerUnit.toFixed(4)}/${e.unit || "unit"}
            </p>
          </div>
          <div>
            <strong>$${e.cost.toFixed(2)}</strong>
            <button class="mini-delete" onclick="deleteExpense('${e._id}')">x</button>
          </div>
        </div>
      `;
  });
}

function renderSales() {
  const box = document.getElementById("salesList");
  box.innerHTML = "";

  sales.sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );

  sales.slice(0, 5).forEach((s) => {
    const items = s.items || {};
    let orderText = "";
    let orderTotal = 0;

    Object.keys(items).forEach((item) => {
      const qty = items[item].qty || 0;
      const price = items[item].price || 0;

      if (qty > 0) {
        if (item === "trio") {
          const flavours = items[item].flavours || {};
          const flavourText = [];

          if (flavours.salmon > 0)
            flavourText.push(`Salmon x${flavours.salmon}`);
          if (flavours.shroom > 0)
            flavourText.push(`Shroom x${flavours.shroom}`);
          if (flavours.chicken > 0)
            flavourText.push(`Chicken x${flavours.chicken}`);
          if (flavours.tuna > 0) flavourText.push(`Tuna x${flavours.tuna}`);

          orderText += `${formatItemName(item)} x ${qty} — $${(qty * price).toFixed(2)}<br>`;
          orderText += `<span class="small-text">→ ${flavourText.join(", ")}</span><br>`;
        } else {
          orderText += `${formatItemName(item)} x ${qty} — $${(qty * price).toFixed(2)}<br>`;
        }

        orderTotal += qty * price;
      }
    });

    box.innerHTML += `
      <div class="list-item">
        <div>
          <strong>${orderText}</strong>
          <p>${s.customerName || "Guest"} · ${s.date} · ${s.method}</p>
        </div>
        <div>
          <strong>$${orderTotal.toFixed(2)}</strong>
          <button class="mini-delete" onclick="deleteSale('${s._id}')">x</button>
        </div>
      </div>
    `;
  });
}

function calculateSummary() {
  const selectedMonth = document.getElementById("summaryMonth").value;

  const monthlySales = sales.filter(
    (s) => s.date && s.date.startsWith(selectedMonth),
  );
  const monthlyExpenses = expenses.filter(
    (e) => e.date && e.date.startsWith(selectedMonth),
  );

  let totalFoodSales = 0;
  let totalProductCost = 0;
  let deliveryCollected = 0;
  let deliveryPaid = 0;
  let totalExpenses = 0;

  monthlySales.forEach((s) => {
    const items = s.items || {};
    let totalTraysInOrder = 0;

    Object.keys(items).forEach((item) => {
      const qty = items[item].qty || 0;
      const price = items[item].price || 0;

      totalFoodSales += qty * price;

      if (item === "trio") {
        const flavours = items[item].flavours || {};

        totalProductCost += (flavours.salmon || 0) * getProductCost("salmon");
        totalProductCost += (flavours.shroom || 0) * getProductCost("shroom");
        totalProductCost += (flavours.chicken || 0) * getProductCost("chicken");
        totalProductCost += (flavours.tuna || 0) * getProductCost("tuna");

        totalTraysInOrder += qty * 3;
      } else {
        totalProductCost += qty * getProductCost(item);

        if (
          item === "salmon" ||
          item === "shroom" ||
          item === "chicken" ||
          item === "tuna" ||
          item === "luncheon"
        ) {
          totalTraysInOrder += qty;
        }
      }
    });

    const thermalBagsNeeded = Math.ceil(totalTraysInOrder / 4);
    totalProductCost += thermalBagsNeeded * getCost("thermalbag");

    deliveryCollected += s.customerDeliveryPaid || 0;
    deliveryPaid += s.driverPaid || 0;
  });

  monthlyExpenses.forEach((e) => {
    totalExpenses += parseFloat(e.cost) || 0;
  });

  const deliveryProfit = deliveryCollected - deliveryPaid;
  const realProfit = totalFoodSales - totalExpenses + deliveryProfit;
  const estimatedProfit = totalFoodSales - totalProductCost;
  const profitMargin =
    totalFoodSales > 0 ? (realProfit / totalFoodSales) * 100 : 0;

  document.getElementById("totalFoodSales").textContent = money(totalFoodSales);
  document.getElementById("totalProductCost").textContent =
    money(totalProductCost);
  document.getElementById("deliveryCollected").textContent =
    money(deliveryCollected);
  document.getElementById("deliveryPaid").textContent = money(deliveryPaid);
  document.getElementById("deliveryProfit").textContent = money(deliveryProfit);
  document.getElementById("totalExpenses").textContent = money(totalExpenses);
  document.getElementById("realProfit").textContent = money(realProfit);
  document.getElementById("estimatedProfit").textContent =
    money(estimatedProfit);
  document.getElementById("profitMargin").textContent =
    profitMargin.toFixed(1) + "%";

  const ownerPercent =
    parseFloat(document.getElementById("ownerPercent").value) || 0;
  const ingredientPercent =
    parseFloat(document.getElementById("ingredientPercent").value) || 0;
  const bufferPercent =
    parseFloat(document.getElementById("bufferPercent").value) || 0;

  document.getElementById("ownerPay").textContent = money(
    (realProfit * ownerPercent) / 100,
  );
  document.getElementById("ingredientFund").textContent = money(
    (realProfit * ingredientPercent) / 100,
  );
  document.getElementById("bufferFund").textContent = money(
    (realProfit * bufferPercent) / 100,
  );

  updateProductCostPreview();
}

function toggleDeliveryFields() {
  const method = document.getElementById("collectionMethod").value;

  document.querySelectorAll(".delivery-field").forEach((field) => {
    field.classList.toggle("hidden", method !== "delivery");
  });
}

function setDeliveryFee() {
  const area = document.getElementById("deliveryArea").value;
  document.getElementById("customerDeliveryPaid").value =
    deliveryFees[area] || 0;
}

async function deleteExpense(id) {
  await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  loadExpenses();
}

async function deleteSale(id) {
  await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
  });

  loadSales();
}

function formatItemName(item) {
  if (item === "trio") return "WAYAKI Trio";
  if (item === "salmon") return "Salmon Deluxe";
  if (item === "shroom") return "Shroom Bliss";
  if (item === "chicken") return "Chicken Comfort";
  if (item === "tuna") return "Tuna Delight";
  if (item === "luncheon") return "Luncheon Melt";
  if (item === "seaweed") return "Seaweed Pack";
  if (item === "tea") return "Tea Bag";
  return item;
}

function money(num) {
  return "$" + Number(num).toFixed(2);
}
