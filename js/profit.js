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

const PRODUCT_NAMES = {
  trio: "WAYAKI Trio",
  salmon: "Salmon Deluxe",
  shroom: "Shroom Bliss",
  chicken: "Chicken Comfort",
  tuna: "Tuna Delight",
  luncheon: "Luncheon Melt",
  seaweed: "Seaweed Pack",
  tea: "Tea Bag",
  upgrade: "Upgrade Set",
};

const MAIN_TRAYS = ["salmon", "shroom", "chicken", "tuna", "luncheon"];
const TRIO_FLAVOURS = ["salmon", "shroom", "chicken", "tuna"];
const EXTRA_ITEMS = ["seaweed", "tea", "upgrade"];
const SALE_PRODUCTS = ["trio", ...MAIN_TRAYS, ...EXTRA_ITEMS];

const DEFAULT_QTY_FIELDS = {
  trio: "qtyTrio",
  salmon: "qtySalmon",
  shroom: "qtyShroom",
  chicken: "qtyChicken",
  tuna: "qtyTuna",
  luncheon: "qtyLuncheon",
  seaweed: "qtySeaweed",
  tea: "qtyTea",
  upgrade: "qtyUpgrade",
};

const DEFAULT_PRICE_FIELDS = {
  trio: "priceTrio",
  salmon: "priceSalmon",
  shroom: "priceShroom",
  chicken: "priceChicken",
  tuna: "priceTuna",
  luncheon: "priceLuncheon",
  seaweed: "priceSeaweed",
  tea: "priceTea",
  upgrade: "priceUpgrade",
};

const TRIO_FIELD_IDS = {
  salmon: "trioSalmon",
  shroom: "trioShroom",
  chicken: "trioChicken",
  tuna: "trioTuna",
};

const COST_PREVIEW_IDS = {
  trio: "trioCostPreview",
  tuna: "tunaCostPreview",
  salmon: "salmonCostPreview",
  chicken: "chickenCostPreview",
  shroom: "shroomCostPreview",
  luncheon: "luncheonCostPreview",
  upgrade: "upgradeCostPreview",
};

const BASE_RECIPES = {
  packaging: {
    tray: 1,
    furikake: 5,
    seaweed: 1,
    logosticker: 1,
    namestickertray: 1,
    receiptstickerbag: 1,
    spoon: 1,
  },

  rice: {
    rice: 90,
    vinegar: 5,
    sugar: 2.5,
    salt: 1,
  },

  salmon: {
    salmon: 55,
    crabstick: 30,
    mayo: 22.5,
    mentaiko: 20,
    creamcheese: 2.5,
  },

  shroom: {
    kingoyster: 50,
    buttonmushroom: 70,
    corn: 50,
    truffle: 5,
    mayo: 30,
    creamcheese: 15,
    cookingcream: 5,
    mozzarella: 15,
  },

  chicken: {
    chicken: 110,
    flour: 8,
    sesameoil: 2,
    teriyaki: 40,
    mayo: 20,
    egg: 1,
  },

  tuna: {
    tuna: 75,
    mayo: 25,
    creamcheese: 10,
    soysauce: 2.5,
    sugar: 1.25,
    sesameoil: 1.25,
    cucumber: 30,
  },

  luncheon: {
    luncheon: 100,
    mayo: 15,
    egg: 1,
  },

  seaweed: {
    seaweed: 1,
  },

  tea: {
    tea: 1,
  },
  upgrade: {
    edamame: 100,
    yuzu: 20,
    tea: 2,
    tray: 1,
    cup: 1,
    cupsticker: 1,
    namestickertray: 1,
  },
};

/* -----------------------------
  Small helpers
----------------------------- */

const $ = (id) => document.getElementById(id);

function money(num) {
  return "$" + Number(num || 0).toFixed(2);
}

function toNumber(value) {
  return Number.parseFloat(value) || 0;
}

function getInputNumber(id) {
  return toNumber($(id)?.value);
}

function getInputText(id, fallback = "") {
  return $(id)?.value?.trim() || fallback;
}

function setInputValue(id, value) {
  const el = $(id);
  if (el) el.value = value;
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function getDateValue(id) {
  return $(id)?.value || "";
}

function sortNewestFirst(list) {
  return [...list].sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );
}

function formatItemName(item) {
  return PRODUCT_NAMES[item] || item;
}

/* -----------------------------
  Cost calculation
----------------------------- */

function getCostPerUnit() {
  const totals = {};

  expenses.forEach((expense) => {
    const tag = (expense.tag || "").toLowerCase().trim();
    const amount = toNumber(expense.amount);
    const cost = toNumber(expense.cost);

    if (!tag || amount <= 0 || cost <= 0) return;

    if (!totals[tag]) {
      totals[tag] = { cost: 0, amount: 0 };
    }

    totals[tag].cost += cost;
    totals[tag].amount += amount;
  });

  return Object.fromEntries(
    Object.entries(totals).map(([tag, total]) => [
      tag,
      total.cost / total.amount,
    ]),
  );
}

function getCost(tag) {
  return getCostPerUnit()[tag] || 0;
}

function getRecipeCost(recipeName) {
  const costPerUnit = getCostPerUnit();
  const recipe = BASE_RECIPES[recipeName] || {};

  return Object.entries(recipe).reduce((total, [tag, amount]) => {
    return total + amount * (costPerUnit[tag] || 0);
  }, 0);
}

function getPackagingCost() {
  return getRecipeCost("packaging");
}

function getRiceCost() {
  return getRecipeCost("rice");
}

function getProductCost(item) {
  if (!BASE_RECIPES[item]) return 0;

  if (MAIN_TRAYS.includes(item)) {
    return getRecipeCost(item) + getRiceCost() + getPackagingCost();
  }

  return getRecipeCost(item);
}

function getAverageTrioCost() {
  return (
    getProductCost("salmon") +
    getProductCost("shroom") +
    getProductCost("chicken") +
    getProductCost("tuna")
  ) / 4 * 3;
}

function updateProductCostPreview() {
  Object.entries(COST_PREVIEW_IDS).forEach(([item, previewId]) => {
    if (item === "trio") {
      setText(previewId, money(getAverageTrioCost()));
    } else {
      setText(previewId, money(getProductCost(item)));
    }
  });
}

/* -----------------------------
  API helpers
----------------------------- */

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

async function postJson(url, data) {
  return requestJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function deleteJson(url) {
  return fetch(url, { method: "DELETE" });
}

/* -----------------------------
  Page setup / loading
----------------------------- */

window.onload = function () {
  const today = new Date();
  const month = today.toISOString().slice(0, 7);

  setInputValue("summaryMonth", month);

  if ($("expenseDate")) $("expenseDate").valueAsDate = today;
  if ($("saleDate")) $("saleDate").valueAsDate = today;

  $("summaryMonth")?.addEventListener("change", calculateSummary);

  loadExpenses();
  loadSales();
};

async function loadExpenses() {
  try {
    expenses = await requestJson(`${API_URL}/expenses`);
    renderExpenses();
    calculateSummary();
  } catch (error) {
    console.error(error);
    alert("Failed to load expenses.");
  }
}

async function loadSales() {
  try {
    sales = await requestJson(`${API_URL}/orders`);
    renderSales();
    calculateSummary();
  } catch (error) {
    console.error(error);
    alert("Failed to load sales.");
  }
}

/* -----------------------------
  Expenses
----------------------------- */

async function addExpense() {
  const date = getDateValue("expenseDate");
  const tag = getInputText("expenseTag").toLowerCase();
  const name = getInputText("expenseName");
  const cost = getInputNumber("expenseCost");
  const amount = getInputNumber("expenseAmount");
  const unit = getInputText("expenseUnit");

  if (!date || !tag || !name || cost <= 0 || amount <= 0) {
    alert("Please fill in date, tag, item name, cost and amount.");
    return;
  }

  await postJson(`${API_URL}/expenses`, {
    date,
    tag,
    name,
    cost,
    amount,
    unit,
    createdAt: new Date().toISOString(),
  });

  ["expenseName", "expenseCost", "expenseAmount"].forEach((id) =>
    setInputValue(id, ""),
  );

  loadExpenses();
}

function renderExpenses() {
  const box = $("expenseList");
  if (!box) return;

  box.innerHTML = sortNewestFirst(expenses)
    .slice(0, 5)
    .map((expense) => {
      const amount = toNumber(expense.amount);
      const cost = toNumber(expense.cost);
      const costPerUnit = amount > 0 ? cost / amount : 0;

      return `
        <div class="list-item">
          <div>
            <strong>${expense.name}</strong>
            <p>
              ${expense.date} · ${expense.tag || "others"} ·
              ${expense.amount || "-"}${expense.unit || ""} ·
              $${costPerUnit.toFixed(4)}/${expense.unit || "unit"}
            </p>
          </div>
          <div>
            <strong>${money(cost)}</strong>
            <button class="mini-delete" onclick="deleteExpense('${expense._id}')">x</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function deleteExpense(id) {
  await deleteJson(`${API_URL}/expenses/${id}`);
  loadExpenses();
}

/* -----------------------------
  Sales
----------------------------- */

function getSaleItemsFromForm() {
  const items = {};

  SALE_PRODUCTS.forEach((product) => {
    items[product] = {
      qty: getInputNumber(DEFAULT_QTY_FIELDS[product]),
      price: getInputNumber(DEFAULT_PRICE_FIELDS[product]),
    };
  });

  items.trio.flavours = Object.fromEntries(
    TRIO_FLAVOURS.map((flavour) => [
      flavour,
      getInputNumber(TRIO_FIELD_IDS[flavour]),
    ]),
  );

  return items;
}

function getTotalItemsQty(items) {
  return Object.values(items).reduce((total, item) => total + (item.qty || 0), 0);
}

function getTrioFlavourTotal(flavours) {
  return TRIO_FLAVOURS.reduce(
    (total, flavour) => total + (flavours[flavour] || 0),
    0,
  );
}

function resetSaleForm() {
  setInputValue("customerName", "");

  Object.values(DEFAULT_QTY_FIELDS).forEach((id) => setInputValue(id, 0));
  Object.values(TRIO_FIELD_IDS).forEach((id) => setInputValue(id, 0));

  setInputValue("customerDeliveryPaid", 0);
  setInputValue("driverPaid", 0);
}

async function addSale() {
  const customerName = getInputText("customerName", "Guest");
  const date = getDateValue("saleDate");
  const method = getInputText("collectionMethod");
  const items = getSaleItemsFromForm();

  const trioQty = items.trio.qty;
  const trioFlavourTotal = getTrioFlavourTotal(items.trio.flavours);

  if (trioFlavourTotal !== trioQty * 3) {
    alert("Trio flavour total must equal WAYAKI Trio Qty × 3.");
    return;
  }

  if (!date || getTotalItemsQty(items) === 0) {
    alert("Please enter date and at least 1 item.");
    return;
  }

  const customerDeliveryPaid =
    method === "delivery" ? getInputNumber("customerDeliveryPaid") : 0;
  const driverPaid = method === "delivery" ? getInputNumber("driverPaid") : 0;

  await postJson(`${API_URL}/orders`, {
    date,
    customerName,
    createdAt: new Date().toISOString(),
    items,
    method,
    customerDeliveryPaid,
    driverPaid,
  });

  resetSaleForm();
  loadSales();
}

function getOrderTotal(items) {
  return Object.values(items).reduce((total, item) => {
    return total + (item.qty || 0) * (item.price || 0);
  }, 0);
}

function getTrioFlavourText(flavours = {}) {
  return TRIO_FLAVOURS
    .filter((flavour) => flavours[flavour] > 0)
    .map((flavour) => {
      const shortName = formatItemName(flavour)
        .replace(" Deluxe", "")
        .replace(" Bliss", "")
        .replace(" Comfort", "")
        .replace(" Delight", "");

      return `${shortName} x${flavours[flavour]}`;
    })
    .join(", ");
}

function getOrderLines(items) {
  return Object.entries(items)
    .filter(([, itemData]) => itemData.qty > 0)
    .map(([item, itemData]) => {
      const lineTotal = money(itemData.qty * itemData.price);
      const mainLine = `${formatItemName(item)} x ${itemData.qty} — ${lineTotal}`;

      if (item !== "trio") return mainLine;

      return `
        ${mainLine}<br>
        <span class="small-text">→ ${getTrioFlavourText(itemData.flavours)}</span>
      `;
    })
    .join("<br>");
}

function renderSales() {
  const box = $("salesList");
  if (!box) return;

  box.innerHTML = sortNewestFirst(sales)
    .slice(0, 5)
    .map((sale) => {
      const items = sale.items || {};
      const orderText = getOrderLines(items);
      const orderTotal = getOrderTotal(items);

      return `
        <div class="list-item">
          <div>
            <strong>${orderText}</strong>
            <p>${sale.customerName || "Guest"} · ${sale.date} · ${sale.method}</p>
          </div>
          <div>
            <strong>${money(orderTotal)}</strong>
            <button class="mini-delete" onclick="deleteSale('${sale._id}')">x</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function deleteSale(id) {
  await deleteJson(`${API_URL}/orders/${id}`);
  loadSales();
}

/* -----------------------------
  Summary
----------------------------- */

function isSameMonth(date, month) {
  return date && date.startsWith(month);
}

function getTraysCount(item, itemData) {
  if (item === "trio") return (itemData.qty || 0) * 3;
  if (MAIN_TRAYS.includes(item)) return itemData.qty || 0;
  return 0;
}

function getItemProductCost(item, itemData) {
  const qty = itemData.qty || 0;

  if (item === "trio") {
    const flavours = itemData.flavours || {};

    return TRIO_FLAVOURS.reduce((total, flavour) => {
      return total + (flavours[flavour] || 0) * getProductCost(flavour);
    }, 0);
  }

  return qty * getProductCost(item);
}

function getOrderProductCost(items) {
  let productCost = 0;
  let traysCount = 0;

  Object.entries(items).forEach(([item, itemData]) => {
    productCost += getItemProductCost(item, itemData);
    traysCount += getTraysCount(item, itemData);
  });

  const thermalBagsNeeded = Math.ceil(traysCount / 5);
  productCost += thermalBagsNeeded * getCost("thermalbag");

  return productCost;
}

function calculateSummary() {
  const selectedMonth = getInputText("summaryMonth");

  const monthlySales = sales.filter((sale) => isSameMonth(sale.date, selectedMonth));
  const monthlyExpenses = expenses.filter((expense) =>
    isSameMonth(expense.date, selectedMonth),
  );

  const summary = {
    totalFoodSales: 0,
    totalProductCost: 0,
    deliveryCollected: 0,
    deliveryPaid: 0,
    totalExpenses: 0,
  };

  monthlySales.forEach((sale) => {
    const items = sale.items || {};

    summary.totalFoodSales += getOrderTotal(items);
    summary.totalProductCost += getOrderProductCost(items);
    summary.deliveryCollected += toNumber(sale.customerDeliveryPaid);
    summary.deliveryPaid += toNumber(sale.driverPaid);
  });

  summary.totalExpenses = monthlyExpenses.reduce(
    (total, expense) => total + toNumber(expense.cost),
    0,
  );

  const deliveryProfit = summary.deliveryCollected - summary.deliveryPaid;
  const realProfit =
    summary.totalFoodSales - summary.totalExpenses + deliveryProfit;
  const estimatedProfit = summary.totalFoodSales - summary.totalProductCost;
  const profitMargin =
    summary.totalFoodSales > 0
      ? (realProfit / summary.totalFoodSales) * 100
      : 0;

  setText("totalFoodSales", money(summary.totalFoodSales));
  setText("totalProductCost", money(summary.totalProductCost));
  setText("deliveryCollected", money(summary.deliveryCollected));
  setText("deliveryPaid", money(summary.deliveryPaid));
  setText("deliveryProfit", money(deliveryProfit));
  setText("totalExpenses", money(summary.totalExpenses));
  setText("realProfit", money(realProfit));
  setText("estimatedProfit", money(estimatedProfit));
  setText("profitMargin", profitMargin.toFixed(1) + "%");

  setText("ownerPay", money((realProfit * getInputNumber("ownerPercent")) / 100));
  setText(
    "ingredientFund",
    money((realProfit * getInputNumber("ingredientPercent")) / 100),
  );
  setText(
    "bufferFund",
    money((realProfit * getInputNumber("bufferPercent")) / 100),
  );

  updateProductCostPreview();
}

/* -----------------------------
  Delivery
----------------------------- */

function toggleDeliveryFields() {
  const method = getInputText("collectionMethod");

  document.querySelectorAll(".delivery-field").forEach((field) => {
    field.classList.toggle("hidden", method !== "delivery");
  });
}

function setDeliveryFee() {
  const area = getInputText("deliveryArea");
  setInputValue("customerDeliveryPaid", DELIVERY_FEES[area] || 0);
}