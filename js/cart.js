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

// get selected date label
function getSelectedOrderDateLabel() {
  const select = document.getElementById("order-date");
  return select.options[select.selectedIndex]?.text || "";
}

// collect all form data
function getFormData() {
  return {
    orderDate: getSelectedOrderDateLabel(),
    pickupTime: document.getElementById("pickup-time").value.trim(),
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    method: getSelectedMethod(),
    pickupLocation:
      document.getElementById("pickup-location")?.innerText.trim() || "",
    area: document.getElementById("area").value.trim(),
    address: document.getElementById("address").value.trim(),
    postal: document.getElementById("postal").value.trim(),
    unit: document.getElementById("unit").value.trim(),
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
  if (!data.orderDate) {
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
  return cart.reduce((total, item) => total + (item.finalPrice || 0), 0);
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
  // get selected method
  const method = getSelectedMethod();

  // main sections
  const deliveryDiv = document.getElementById("delivery-options");
  const selfDiv = document.getElementById("self-options");

  // late timing slot
  const lateSlot = document.getElementById("late-slot");

  // time dropdown
  const timeSelect = document.getElementById("pickup-time");

  // delivery radio button
  const deliveryRadio = document.querySelector('input[value="delivery"]');

  // total main trays in cart
  const totalTrays = getTotalMainTrays();

  // disable delivery if less than 2 trays
  if (totalTrays < 2) {
    deliveryRadio.disabled = true;

    // auto switch back to self collect
    if (deliveryRadio.checked) {
      document.querySelector('input[value="self"]').checked = true;
    }
  } else {
    // enable delivery
    deliveryRadio.disabled = false;
  }

  // show delivery section only when delivery selected
  deliveryDiv.style.display = method === "delivery" ? "block" : "none";

  // show self collect section only when self selected
  selfDiv.style.display = method === "self" ? "block" : "none";

  // enable / disable delivery inputs
  const deliveryInputs = deliveryDiv.querySelectorAll("input, select");

  deliveryInputs.forEach((input) => {
    input.disabled = method !== "delivery";
  });

  // handle self collect only timing slot
  if (lateSlot) {
    // if delivery selected
    if (method === "delivery") {
      // hide late slot
      lateSlot.disabled = true;
      lateSlot.style.display = "none";

      // remove selected late slot if chosen before
      if (timeSelect.value === lateSlot.value) {
        timeSelect.value = "";
      }
    } else {
      // show late slot for self collect
      lateSlot.disabled = false;
      lateSlot.style.display = "block";
    }
  }

  // refresh totals
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
    message += `* ${item.name} x ${item.qty} — $${item.finalPrice.toFixed(2)}\n`;

    if (item.removed?.length) {
      message += `  No: ${item.removed.join(", ")}\n`;
    }
    
    if (item.selectedFlavours && item.selectedFlavours.length > 0) {

      message += `  Flavours: ${item.selectedFlavours.join(", ")}\n`;
    
    }
    
    if (item.id === "upgrade") {
      message += `  Includes: Edamame + Yuzu Jasmine Tea\n`;
    }

    if (item.rice) {
      message += `  Rice: ${item.rice}\n`;
    }

    if (item.addons?.length) {
      message += `  Add-ons: ${item.addons.join(", ")}\n`;
    }

    if (item.instructions) {
      message += `  Note: ${item.instructions}\n`;
    }

    message += `\n`;
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

// render all cart items on page
function renderCart() {
  const cartList = document.getElementById("cart-list");

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty!</li>";
    updateTotal();
    return;
  }

  let html = "";

  cart.forEach((item, index) => {
    html += `
          <li class="cart-block">

            <div class="cart-row">

              <img src="${item.image}" class="cart-item-img" alt="${item.name}">

              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>

                ${item.selectedFlavours?.length 
                  ? `<div class="cart-note">Flavours: ${item.selectedFlavours.join(", ")}</div>` 
                  : ""
                }

                ${item.id === "upgrade" 
                  ? `<div class="cart-note">Includes: Edamame + Yuzu Jasmine Tea</div>` 
                  : ""
                }

                ${item.rice ? `<div class="cart-note">${item.rice}</div>` : ""}
                ${item.addons?.length ? `<div class="cart-note">+ ${item.addons.join(", ")}</div>` : ""}
                ${item.removed?.length ? `<div class="cart-note">No ${item.removed.join(", ")}</div>` : ""}
                ${item.instructions ? `<div class="cart-note">${item.instructions}</div>` : ""}

                ${
                  item.id === "trio"
                    ? `<div class="free-seaweed-line">🎁 Free ${item.qty * 3} seaweed</div>`
                    : ["salmon","shroom","chicken","tuna","luncheon"].includes(item.id)
                      ? `<div class="free-seaweed-line">🎁 Free ${item.qty} seaweed</div>`
                      : ``
                }

                <div class="cart-actions">
                  <div class="cart-qty-control">
                    <button onclick="changeCartQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeCartQty(${index}, 1)">+</button>
                  </div>


                </div>

              </div>

              <div class="cart-item-price">                  
                <button class="edit-cart-btn"
                    onclick="editCartItem(${index})">
                    Edit
                  </button>
                $${item.finalPrice.toFixed(2)}
              </div>

            </div>
          </li>
        `;
  });
  html += `
    <li class="cart-block add-more-block">
      <a href="index.html" class="add-more-link">
        + Add More Items
      </a>
    </li>
  `;
  
  cartList.innerHTML = html;
  updateTotal();
}

function changeCartQty(index, delta) {
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  } else {
    const unitPrice = cart[index].finalPrice / (cart[index].qty - delta);
    cart[index].finalPrice = unitPrice * cart[index].qty;
  }

  localStorage.setItem("sushibakeCart", JSON.stringify(cart));
  renderCart();
  toggleDelivery();
}

function editCartItem(index) {
  const itemId = cart[index].id;
  window.location.href = `product.html?item=${itemId}&edit=${index}`;
}

function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("sushibakeCart", JSON.stringify(cart));
  renderCart();
  toggleDelivery();
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
  // order date dropdown
  const select = document.getElementById("order-date");
  // current date and time
  const now = new Date();

  // reset dropdown
  select.innerHTML = `<option value="">Select a date</option>`;

  // date when May Drops open
  const orderOpenDate = new Date(2026, 4, 31, 0, 0, 0, 0);
  // first delivery date
  const firstDeliveryDate = new Date(2026, 5, 1, 0, 0, 0, 0);

  // dates that are sold out
  const soldOutDates = [
    "2026-06-16", // 22 May sold out
  ];

  // if customers visit before order opening date
  if (now < orderOpenDate) {
    const option = document.createElement("option");

    option.value = "";
    option.textContent = "July Drops open on 29 June";
    option.disabled = true;

    select.appendChild(option);
    return;
  }

  // generate dates for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(firstDeliveryDate);
    date.setDate(firstDeliveryDate.getDate() + i);

    // get day of week
    const dayOfWeek = date.getDay();

    // skip Saturday and Sunday
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // get cutoff for this date
    const cutoff = getCutoffDate(date);

    // only show date if cutoff has not passed
    if (now <= cutoff) {
      const option = document.createElement("option");
      option.value = formatDateValue(date);
      option.textContent = formatDateLabel(date);

      // show sold out date but disable selection
      if (soldOutDates.includes(option.value)) {
        option.disabled = true;
        option.textContent = `${formatDateLabel(date)} — SOLD OUT`;
      }

      // add date to dropdown
      select.appendChild(option);
    }
  }
}

populateOrderDates();
renderCart();
toggleDelivery();
