// ================================================
// Delivery fees, totals and collection method
// ================================================


// ========================
// DELIVERY FEES
// Delivery charges for each delivery area
// ========================

const deliveryFees = {
  north: 8,
  west: 12,
  northeast: 12,
  central: 15,
  east: 15
};


// ========================
// COLLECTION METHOD
// Get the selected collection method
// ========================

function getSelectedMethod() {
  const selectedMethod =
    document.querySelector(
      'input[name="method"]:checked'
    );

  return selectedMethod?.value || "";
}


// ========================
// CART SUBTOTAL
// Calculate the subtotal of all cart items
// ========================

function calculateSubtotal() {
  return cart.reduce(
    (total, item) =>
      total +
      Number(item.finalPrice || 0),
    0
  );
}


// ========================
// DELIVERY DISCOUNT
// Calculate the delivery discount based on subtotal
// ========================

function getDeliveryDiscount(
  subtotal,
  area
) {
  if (subtotal >= 50) {
    if (
      area === "north" ||
      area === "west" ||
      area === "northeast"
    ) {
      return "free";
    }

    if (
      area === "central" ||
      area === "east"
    ) {
      return 5;
    }
  }

  if (subtotal >= 35) {
    return 3;
  }

  return 0;
}


// ========================
// DELIVERY FEE
// Calculate the final delivery fee
// ========================

function getDeliveryFee() {
  const method = getSelectedMethod();

  if (method !== "delivery") {
    return 0;
  }

  const area =
    document.getElementById("area").value;

  const originalFee =
    deliveryFees[area] || 0;

  const subtotal =
    calculateSubtotal();

  const discount =
    getDeliveryDiscount(
      subtotal,
      area
    );

  if (discount === "free") {
    return 0;
  }

  return Math.max(
    originalFee - discount,
    0
  );
}


// ========================
// ORDER TOTAL
// Calculate the final order total
// ========================

function calculateTotal() {
  return (
    calculateSubtotal() +
    getDeliveryFee()
  ).toFixed(2);
}


// ========================
// UPDATE TOTALS
// Update the subtotal, delivery fee and total display
// ========================

function updateTotal() {
  const subtotal =
    calculateSubtotal();

  const deliveryFee =
    getDeliveryFee();

  const total =
    subtotal + deliveryFee;

  document.getElementById(
    "subtotal-price"
  ).textContent =
    subtotal.toFixed(2);

  document.getElementById(
    "total-price"
  ).textContent =
    total.toFixed(2);

  const deliveryLine =
    document.getElementById(
      "delivery-line"
    );

  const deliveryText =
    document.getElementById(
      "delivery-fee-text"
    );

  if (
    getSelectedMethod() === "delivery"
  ) {
    deliveryLine.style.display = "flex";

    const area =
      document.getElementById(
        "area"
      ).value;

    const originalFee =
      deliveryFees[area] || 0;

    if (!area) {
      deliveryText.textContent = "-";
    } else if (
      deliveryFee === 0 &&
      subtotal >= 50 &&
      originalFee > 0
    ) {
      deliveryText.innerHTML = `
        <span class="old-delivery">
          $${originalFee.toFixed(2)}
        </span>

        <span class="free-delivery">
          FREE
        </span>
      `;
    } else if (
      deliveryFee < originalFee &&
      originalFee > 0
    ) {
      deliveryText.innerHTML = `
        <span class="old-delivery">
          $${originalFee.toFixed(2)}
        </span>

        <span class="new-delivery">
          $${deliveryFee.toFixed(2)}
        </span>
      `;
    } else {
      deliveryText.textContent =
        `$${deliveryFee.toFixed(2)}`;
    }
  } else {
    deliveryLine.style.display = "none";
  }
}


// ========================
// TOGGLE DELIVERY
// Toggle delivery and self-collection options
// ========================

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

  // Delivery requires at least 2 trays
  if (totalTrays < 2) {
    deliveryRadio.disabled = true;

    if (deliveryRadio.checked) {
      selfRadio.checked = true;
    }
  } else {
    deliveryRadio.disabled = false;
  }

  // ========================
  // TEMPORARY SELF COLLECTION ONLY
  // 17 Aug - 31 Aug 2026
  // ========================

  // deliveryRadio.disabled = true;

  // if (deliveryRadio.checked) {
  //   selfRadio.checked = true;
  // }

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
        timeSelect.value ===
        lateSlot.value
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