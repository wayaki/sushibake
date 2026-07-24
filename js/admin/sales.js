const API_URL = "http://localhost:3000/api";

let allSales = [];
let editingSaleId = null;

async function loadSales() {
  const res = await fetch(`${API_URL}/orders`);
  allSales = await res.json();

  allSales.sort((a, b) =>
    new Date(b.createdAt || b.date) -
    new Date(a.createdAt || a.date)
  );

  const today = new Date();
  document.getElementById("salesMonth").value = today.toISOString().slice(0, 7);

  filterSalesByMonth();
}

function filterSalesByMonth() {
  const selectedMonth = document.getElementById("salesMonth").value;

  const filteredSales = allSales.filter(s =>
    s.date && s.date.startsWith(selectedMonth)
  );

  renderSales(filteredSales);
}

function showAllSales() {
  document.getElementById("salesMonth").value = "";
  renderSales(allSales);
}

function renderSales(sales) {
  const box = document.getElementById("allSalesList");

  box.innerHTML = "";

  sales.forEach((s) => {
    const items = s.items || {};
    let orderText = "";
    let orderTotal = 0;

    Object.keys(items).forEach(item => {
      const qty = items[item].qty || 0;
      const price = items[item].price || 0;

      if (qty > 0) {
        orderText += `${formatItemName(item)} x ${qty} — $${(qty * price).toFixed(2)}<br>`;
        orderTotal += qty * price;
      }
    });

    box.innerHTML += `
      <div class="list-item">
        <div>
          <strong>${orderText}</strong>
          <p>${s.customerName || "Guest"} · ${s.date} · ${s.method}</p>
        </div>

        <div class="expense-actions">
        <strong>$${orderTotal.toFixed(2)}</strong>

        <button class="mini-edit" onclick='openEditSaleModal(${JSON.stringify(s)})'>
            ✏️
        </button>
        </div>
      </div>
    `;
  });
}

function openEditSaleModal(sale) {
  editingSaleId = sale._id;

  const items = sale.items || {};

  document.getElementById("editCustomerName").value = sale.customerName || "";
  document.getElementById("editSaleDate").value = sale.date || "";

  document.getElementById("editQtyTrio").value = items.trio?.qty || 0;
  document.getElementById("editPriceTrio").value = items.trio?.price || 31.90;

  document.getElementById("editTrioSalmon").value = items.trio?.flavours?.salmon || 0;
  document.getElementById("editTrioShroom").value = items.trio?.flavours?.shroom || 0;
  document.getElementById("editTrioChicken").value = items.trio?.flavours?.chicken || 0;
  document.getElementById("editTrioTuna").value = items.trio?.flavours?.tuna || 0;

  document.getElementById("editQtySalmon").value = items.salmon?.qty || 0;
  document.getElementById("editPriceSalmon").value = items.salmon?.price || 12.90;

  document.getElementById("editQtyShroom").value = items.shroom?.qty || 0;
  document.getElementById("editPriceShroom").value = items.shroom?.price || 11.90;

  document.getElementById("editQtyChicken").value = items.chicken?.qty || 0;
  document.getElementById("editPriceChicken").value = items.chicken?.price || 10.90;

  document.getElementById("editQtyTuna").value = items.tuna?.qty || 0;
  document.getElementById("editPriceTuna").value = items.tuna?.price || 9.90;

  document.getElementById("editQtyLuncheon").value = items.luncheon?.qty || 0;
  document.getElementById("editPriceLuncheon").value = items.luncheon?.price || 5.90;

  document.getElementById("editQtyUpgrade").value = items.upgrade?.qty || 0;
  document.getElementById("editPriceUpgrade").value = items.upgrade?.price || 2.90;

  document.getElementById("editQtySeaweed").value = items.seaweed?.qty || 0;
  document.getElementById("editPriceSeaweed").value = items.seaweed?.price || 1.00;

  document.getElementById("editQtyTea").value = items.tea?.qty || 0;
  document.getElementById("editPriceTea").value = items.tea?.price || 0.50;

  document.getElementById("editMethod").value = sale.method || "self";

  toggleEditDeliveryFields();
  document.getElementById("editCustomerDeliveryPaid").value = sale.customerDeliveryPaid || 0;
  document.getElementById("editDriverPaid").value = sale.driverPaid || 0;

  document.getElementById("editSaleModal").classList.remove("hidden");
}

function closeEditSaleModal() {
  editingSaleId = null;
  document.getElementById("editSaleModal").classList.add("hidden");
}

async function saveEditedSale() {
  if (!editingSaleId) return;

  const updatedSale = {
    customerName: document.getElementById("editCustomerName").value || "Guest",
    date: document.getElementById("editSaleDate").value,
    items: {
      trio: {
        qty: parseInt(document.getElementById("editQtyTrio").value) || 0,
        price: parseFloat(document.getElementById("editPriceTrio").value) || 31.90,
        flavours: {
            salmon: parseInt(document.getElementById("editTrioSalmon").value) || 0,
            shroom: parseInt(document.getElementById("editTrioShroom").value) || 0,
            chicken: parseInt(document.getElementById("editTrioChicken").value) || 0,
            tuna: parseInt(document.getElementById("editTrioTuna").value) || 0
        }
      },
      salmon: {
        qty: parseInt(document.getElementById("editQtySalmon").value) || 0,
        price: parseFloat(document.getElementById("editPriceSalmon").value) || 0
      },
      shroom: {
        qty: parseInt(document.getElementById("editQtyShroom").value) || 0,
        price: parseFloat(document.getElementById("editPriceShroom").value) || 0
      },
      chicken: {
        qty: parseInt(document.getElementById("editQtyChicken").value) || 0,
        price: parseFloat(document.getElementById("editPriceChicken").value) || 0
      },
      tuna: {
        qty: parseInt(document.getElementById("editQtyTuna").value) || 0,
        price: parseFloat(document.getElementById("editPriceTuna").value) || 0
      },
      luncheon: {
        qty: parseInt(document.getElementById("editQtyLuncheon").value) || 0,
        price: parseFloat(document.getElementById("editPriceLuncheon").value) || 0
      },
      upgrade: {
        qty: parseInt(document.getElementById("editQtyUpgrade").value) || 0,
        price: parseFloat(document.getElementById("editPriceUpgrade").value) || 0
      },
      seaweed: {
        qty: parseInt(document.getElementById("editQtySeaweed").value) || 0,
        price: parseFloat(document.getElementById("editPriceSeaweed").value) || 0
      },
      tea: {
        qty: parseInt(document.getElementById("editQtyTea").value) || 0,
        price: parseFloat(document.getElementById("editPriceTea").value) || 0
      }
    },
    method: document.getElementById("editMethod").value,
    customerDeliveryPaid: parseFloat(document.getElementById("editCustomerDeliveryPaid").value) || 0,
    driverPaid: parseFloat(document.getElementById("editDriverPaid").value) || 0
  };

  if (!updatedSale.date) {
    alert("Please enter order date.");
    return;
  }

  await fetch(`${API_URL}/orders/${editingSaleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedSale)
  });

  closeEditSaleModal();
  loadSales();
}

function toggleEditDeliveryFields() {
  const method =
    document.getElementById("editMethod").value;

  const fields =
    document.getElementById("editDeliveryFields");

  if (method === "delivery") {
    fields.style.display = "block";
  } else {
    fields.style.display = "none";
  }
}

function formatItemName(item) {
  if (item === "trio") return "WAYAKI Trio";
    if (item === "tuna") return "Tuna Delight";
    if (item === "salmon") return "Salmon Deluxe";
    if (item === "chicken") return "Chicken Comfort";
    if (item === "shroom") return "Shroom Bliss";
    if (item === "luncheon") return "Luncheon Melt";
    if (item === "upgrade") return "Upgrade Set";
    if (item === "seaweed") return "Seaweed Pack";
    if (item === "tea") return "Tea Bag";
  return item;
}

loadSales();