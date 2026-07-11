// get saved cart from localStorage
let cart = JSON.parse(localStorage.getItem("sushibakeCart")) || [];

// delivery fee by area
const deliveryFees = {
  north: 8,
  west: 12,
  northeast: 12,
  central: 15,
  east: 15,
};

// get selected collection method
function getSelectedMethod() {
  return document.querySelector('input[name="method"]:checked').value;
}

// check if cart has items
function hasCartItems() {
  return cart.length > 0;
}

function getSelectedOrderDateValue() {
  return document
    .getElementById("order-date")
    .value;
}

function getSelectedOrderDateLabel() {
  const select =
    document.getElementById("order-date");

  if (!select.value) {
    return "";
  }

  return select.options[
    select.selectedIndex
  ]?.text || "";
}

// collect all form data
function getFormData() {
  return {
    orderDateValue:
      getSelectedOrderDateValue(),

    orderDate:
      getSelectedOrderDateLabel(),

    pickupTime:
      document
        .getElementById("pickup-time")
        .value
        .trim(),

    name:
      document
        .getElementById("name")
        .value
        .trim(),

    phone:
      document
        .getElementById("phone")
        .value
        .trim(),

    method:
      getSelectedMethod(),

    pickupLocation:
      document
        .getElementById("pickup-location")
        ?.innerText
        .trim() || "",

    area:
      document
        .getElementById("area")
        .value
        .trim(),

    address:
      document
        .getElementById("address")
        .value
        .trim(),

    postal:
      document
        .getElementById("postal")
        .value
        .trim(),

    unit:
      document
        .getElementById("unit")
        .value
        .trim()
  };
}

// validate order form
function validateForm(data) {
  // check empty cart
  if (!hasCartItems()) {
    return "Your cart is empty!";
  }

  // check name
  if (!data.name) {
    return "Please enter your full name.";
  }

  // check phone number
  if (!data.phone) {
    return "Please enter your phone number.";
  }

  // check order date
  if (!data.orderDateValue) {
    return "Please select an order date.";
  }

  // check time slot
  if (!data.pickupTime) {
    return "Please select a preferred time.";
  }

  // delivery validations
  if (data.method === "delivery") {
    // minimum trays for delivery
    if (getTotalMainTrays() < 2) {
      return "Delivery is available for minimum 2 trays.";
    }

    // check delivery area
    if (!data.area) {
      return "Please select a delivery area.";
    }

    // check address
    if (!data.address) {
      return "Please enter your delivery address.";
    }

    // check postal code
    if (!data.postal) {
      return "Please enter your postal code.";
    }

    // validate postal code format
    if (!/^\d{6}$/.test(data.postal)) {
      return "Please enter a valid 6-digit postal code.";
    }

    // check unit number
    if (!data.unit) {
      return "Please enter your unit number.";
    }
  }

  return null;
}

// calculate subtotal price
function calculateSubtotal() {
  return cart.reduce(
    (total, item) =>
      total +
      Number(item.finalPrice || 0),
    0
  );
}

// calculate delivery discount
function getDeliveryDiscount(subtotal, area) {
  // $50 promo
  if (subtotal >= 50) {
    // free delivery
    if (area === "north" || area === "west" || area === "northeast") {
      return "free";
    }

    // $5 off
    if (area === "central" || area === "east") {
      return 5;
    }
  }

  // $35 promo
  if (subtotal >= 35) {
    // $3 off
    return 3;
  }

  return 0;
}

// calculate delivery fee
function getDeliveryFee() {
  const method = getSelectedMethod();

  // no fee for self collect
  if (method !== "delivery") return 0;

  const area = document.getElementById("area").value;
  const originalFee = deliveryFees[area] || 0;
  const subtotal = calculateSubtotal();

  const discount = getDeliveryDiscount(subtotal, area);

  // free delivery
  if (discount === "free") {
    return 0;
  }

  return Math.max(originalFee - discount, 0);
}

// calculate final total
function calculateTotal() {
  const subtotal = calculateSubtotal();
  const deliveryFee = getDeliveryFee();
  return (subtotal + deliveryFee).toFixed(2);
}

// update subtotal, delivery fee and total
function updateTotal() {
  const subtotal = calculateSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  document.getElementById("subtotal-price").textContent = subtotal.toFixed(2);

  document.getElementById("total-price").textContent = total.toFixed(2);

  const deliveryLine = document.getElementById("delivery-line");
  const deliveryText = document.getElementById("delivery-fee-text");

  // if delivery selected
  if (getSelectedMethod() === "delivery") {
    deliveryLine.style.display = "flex";

    const area = document.getElementById("area").value;

    const originalFee = deliveryFees[area] || 0;

    // no area selected
    if (!area) {
      deliveryText.textContent = "-";
      // free delivery promo
    } else if (deliveryFee === 0 && subtotal >= 50 && originalFee > 0) {
      deliveryText.innerHTML = `
            <span class="old-delivery">$${originalFee.toFixed(2)}</span>
            <span class="free-delivery">FREE</span>
          `;

      // discounted delivery
    } else if (deliveryFee < originalFee && originalFee > 0) {
      deliveryText.innerHTML = `
            <span class="old-delivery">$${originalFee.toFixed(2)}</span>
            <span class="new-delivery">$${deliveryFee.toFixed(2)}</span>
          `;

      // normal delivery fee
    } else {
      deliveryText.textContent = `$${deliveryFee.toFixed(2)}`;
    }
  } else {
    // hide delivery fee for self collect
    deliveryLine.style.display = "none";
  }
}

// toggle between self collect and delivery
function toggleDelivery() {
  const deliveryDiv =
    document.getElementById(
      "delivery-options"
    );

  const selfDiv =
    document.getElementById(
      "self-options"
    );

  const lateSlot =
    document.getElementById(
      "late-slot"
    );

  const timeSelect =
    document.getElementById(
      "pickup-time"
    );

  const deliveryRadio =
    document.querySelector(
      'input[name="method"][value="delivery"]'
    );

  const selfRadio =
    document.querySelector(
      'input[name="method"][value="self"]'
    );

  const totalTrays =
    getTotalMainTrays();

  if (totalTrays < 2) {
    deliveryRadio.disabled = true;

    if (deliveryRadio.checked) {
      selfRadio.checked = true;
    }
  } else {
    deliveryRadio.disabled = false;
  }

  // Get method after possibly switching radio
  const method =
    getSelectedMethod();

  deliveryDiv.style.display =
    method === "delivery"
      ? "block"
      : "none";

  selfDiv.style.display =
    method === "self"
      ? "block"
      : "none";

  const deliveryInputs =
    deliveryDiv.querySelectorAll(
      "input, select"
    );

  deliveryInputs.forEach((input) => {
    input.disabled =
      method !== "delivery";
  });

  if (lateSlot) {
    if (method === "delivery") {
      lateSlot.disabled = true;
      lateSlot.style.display = "none";

      if (
        timeSelect.value === lateSlot.value
      ) {
        timeSelect.value = "";
      }
    } else {
      lateSlot.disabled = false;
      lateSlot.style.display = "block";
    }
  }

  updateTotal();
}

// build WhatsApp order message
function buildOrderMessage(data) {
  // customer greeting
  let message = `Hello! My name is ${data.name}.\n`;
  message += `I'd like to order from WAYAKI Sushibake 🍣\n\n`;

  // order date and time
  message += `Order Date: ${data.orderDate}\n`;
  message += `Preferred Time: ${data.pickupTime}\n\n`;

  // order items
  message += `Order:\n`;

  cart.forEach((item) => {
    message +=
      `* ${item.name} x ${item.qty}` +
      ` — $${Number(item.finalPrice).toFixed(2)}\n`;

    if (
      item.id === "trio" &&
      Array.isArray(item.trays)
    ) {
      item.trays.forEach((tray) => {
        message +=
          `  Tray ${tray.trayNumber}: ` +
          `${tray.flavour}\n`;

        message +=
          `    Base: ${tray.base}\n`;

        message +=
          `    Portion: ${tray.portion}\n`;

        if (tray.removed?.length) {
          message +=
            `    No: ${tray.removed.join(", ")}\n`;
        }
      });
    } else {
      if (item.base) {
        message +=
          `  Base: ${item.base}\n`;
      }

      if (item.portion) {
        message +=
          `  Portion: ${item.portion}\n`;
      }

      if (item.removed?.length) {
        message +=
          `  No: ${item.removed.join(", ")}\n`;
      }
    }

    if (
      item.upgrade &&
      item.upgrade !== "No Upgrade"
    ) {
      message +=
        `  Upgrade: ${item.upgrade}\n`;
    }

    if (item.instructions) {
      message +=
        `  Note: ${item.instructions}\n`;
    }

    message += "\n";
  });

  // collection method
  message += `\nCollection Method: ${data.method === "self" ? "Self-Collect" : "Delivery"}`;

  // self collect details
  if (data.method === "self") {
    message += `\nPick-up Location: \n ${data.pickupLocation}`;
  } else {
    // delivery fee details
    const originalFee = deliveryFees[data.area] || 0;
    const finalFee = getDeliveryFee();
    const subtotal = calculateSubtotal();
    const areaLabel = data.area.charAt(0).toUpperCase() + data.area.slice(1);

    // delivery address details
    message += `\nDelivery Area: ${areaLabel}`;

    // free delivery promo
    if (finalFee === 0 && subtotal >= 50) {
      message += `\nDelivery Fee: FREE`;

      // discounted delivery promo
    } else if (finalFee < originalFee) {
      message += `\nDelivery Fee: $${finalFee.toFixed(2)} (Promo applied)`;

      // normal delivery fee
    } else {
      message += `\nDelivery Fee: $${finalFee.toFixed(2)}`;
    }
    // delivery details
    message += `\nAddress: ${data.address}`;
    message += `\nPostal Code: ${data.postal}`;
    message += `\nUnit No: ${data.unit}`;
  }

  // contact and final total
  message += `\n\nContact Number: ${data.phone}`;
  message += `\nTotal: $${calculateTotal()}`;

  return message;
}

// send order to WhatsApp
function orderWhatsApp() {
  // get customer form data
  const data = getFormData();

  // check if form has any error
  const error = validateForm(data);

  // stop order if there is an error
  if (error) {
    alert(error);
    return;
  }

  // build WhatsApp order message
  const message = buildOrderMessage(data);

  // WAYAKI WhatsApp number
  const phone = "6584840768";

  // create WhatsApp link with order message
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  // open WhatsApp in new tab
  window.open(url, "_blank");

  // clear cart after order is sent
  setTimeout(() => {
    localStorage.setItem("sushibakeCart", JSON.stringify([]));

    cart = [];
    renderCart();
    updateTotal();
  }, 1500);
}

function renderTrioTrayDetails(item) {
  if (
    item.id !== "trio" ||
    !Array.isArray(item.trays)
  ) {
    return "";
  }

  return item.trays
    .map((tray) => {
      const removedText =
        tray.removed?.length
          ? `
            <div class="cart-note">
              No: ${tray.removed.join(", ")}
            </div>
          `
          : "";

      return `
        <div class="trio-cart-tray">
          <div class="trio-cart-tray-title">
            Tray ${tray.trayNumber}: ${tray.flavour}
          </div>

          <div class="cart-note">
            Base: ${tray.base}
          </div>

          <div class="cart-note">
            Portion: ${tray.portion}
          </div>

          ${removedText}
        </div>
      `;
    })
    .join("");
}

// render all cart items on page
function renderCart() {
  const cartList =
    document.getElementById("cart-list");

  if (cart.length === 0) {
    cartList.innerHTML =
      "<li>Your cart is empty!</li>";

    updateTotal();
    return;
  }

  let html = "";

  cart.forEach((item, index) => {
    const isTrio = item.id === "trio";

    const normalProductDetails = !isTrio
      ? `
          ${
            item.base
              ? `
                <div class="cart-note">
                  Base: ${item.base}
                </div>
              `
              : ""
          }

          ${
            item.portion
              ? `
                <div class="cart-note">
                  Portion: ${item.portion}
                </div>
              `
              : ""
          }

          ${
            item.removed?.length
              ? `
                <div class="cart-note">
                  No: ${item.removed.join(", ")}
                </div>
              `
              : ""
          }
        `
      : "";

    const upgradeDetails =
      item.upgrade &&
      item.upgrade !== "No Upgrade"
        ? `
          <div class="cart-note">
            ${item.upgrade}
          </div>
        `
        : "";

    const instructionsDetails =
      item.instructions
        ? `
          <div class="cart-note">
            Note: ${item.instructions}
          </div>
        `
        : "";

    const freeSeaweedDetails =
      item.id === "trio"
        ? `
          <div class="free-seaweed-line">
            🎁 Free ${item.qty * 3} seaweed
          </div>
        `
        : [
              "salmon",
              "shroom",
              "chicken",
              "tuna",
              "luncheon"
            ].includes(item.id)
          ? `
            <div class="free-seaweed-line">
              🎁 Free ${item.qty} seaweed
            </div>
          `
          : "";

    html += `
      <li class="cart-block">

        <div class="cart-row">

          <img
            src="${item.image}"
            class="cart-item-img"
            alt="${item.name}"
          >

          <div class="cart-item-info">

            <div class="cart-item-name">
              ${item.name}
            </div>

            ${
              isTrio
                ? renderTrioTrayDetails(item)
                : normalProductDetails
            }

            ${upgradeDetails}

            ${instructionsDetails}

            ${freeSeaweedDetails}

            <div class="cart-actions">

              <div class="cart-qty-control">

                <button
                  type="button"
                  onclick="changeCartQty(${index}, -1)"
                >
                  −
                </button>

                <span>${item.qty}</span>

                <button
                  type="button"
                  onclick="changeCartQty(${index}, 1)"
                >
                  +
                </button>

              </div>

            </div>

          </div>

          <div class="cart-item-price">

            <button
              type="button"
              class="edit-cart-btn"
              onclick="editCartItem(${index})"
            >
              Edit
            </button>

            $${Number(item.finalPrice).toFixed(2)}

          </div>

        </div>

      </li>
    `;
  });

  html += `
    <li class="cart-block add-more-block">
      <a
        href="index.html"
        class="add-more-link"
      >
        + Add More Items
      </a>
    </li>
  `;

  cartList.innerHTML = html;

  updateTotal();
}

function changeCartQty(index, delta) {
  const item = cart[index];

  if (!item) {
    return;
  }

  const unitPrice =
    Number(
      item.unitPrice ||
      item.finalPrice / item.qty
    );

  item.qty += delta;

  if (item.qty <= 0) {
    cart.splice(index, 1);
  } else {
    item.unitPrice = unitPrice;
    item.finalPrice =
      unitPrice * item.qty;
  }

  localStorage.setItem(
    "sushibakeCart",
    JSON.stringify(cart)
  );

  renderCart();
  toggleDelivery();
}

function editCartItem(index) {
  const itemId = cart[index].id;
  window.location.href = `product.html?item=${itemId}&edit=${index}`;
}

// count total main trays in cart
function getTotalMainTrays() {
  return cart.reduce((total, item) => {
    if (item.id === "trio") {
      return total + item.qty * 3;
    }

    const mains = ["salmon", "shroom", "tuna", "chicken", "luncheon"];

    if (mains.includes(item.id)) {
      return total + item.qty;
    }

    return total;
  }, 0);
}

// format date value for dropdown
function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// format date label shown to customer
function formatDateLabel(date) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-SG", options);
}

// get order cutoff date
function getCutoffDate(orderDate) {
  const cutoff = new Date(orderDate);
  // cutoff is 1 day before order date
  cutoff.setDate(orderDate.getDate() - 1);

  // cutoff time is 8PM
  cutoff.setHours(20, 0, 0, 0);
  return cutoff;
}

// create order date dropdown options
function populateOrderDates() {
  const select =
    document.getElementById("order-date");

  const now = new Date();

  select.innerHTML =
    `<option value="">Select a date</option>`;

  const soldOutDates = [
    // Example:
    // "2026-07-15"
  ];

  // Generate upcoming 30 calendar days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(now);

    date.setHours(0, 0, 0, 0);
    date.setDate(now.getDate() + i);

    const dayOfWeek = date.getDay();

    // Skip weekends
    if (
      dayOfWeek === 0 ||
      dayOfWeek === 6
    ) {
      continue;
    }

    const cutoff =
      getCutoffDate(date);

    if (now > cutoff) {
      continue;
    }

    const option =
      document.createElement("option");

    option.value =
      formatDateValue(date);

    option.textContent =
      formatDateLabel(date);

    if (
      soldOutDates.includes(option.value)
    ) {
      option.disabled = true;

      option.textContent =
        `${formatDateLabel(date)} — SOLD OUT`;
    }

    select.appendChild(option);
  }
}

populateOrderDates();
renderCart();
toggleDelivery();
