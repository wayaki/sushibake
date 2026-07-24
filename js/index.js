// ================================================
// Menu page interactions and order cutoff
// ================================================


// ========================
// OPEN PRODUCT PAGE
// Navigate to the selected product page
// ========================

function goToProduct(itemId) {
  window.location.href =
    `product.html?item=${itemId}`;
}


// ========================
// UPDATE CART BAR
// Display the total cart quantity and price
// ========================

function updateCartBar() {
  const cart =
    JSON.parse(
      localStorage.getItem(
        "sushibakeCart"
      )
    ) || [];

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.qty;
    totalPrice += item.finalPrice;
  });

  const bar =
    document.getElementById(
      "cartBar"
    );

  if (!bar) {
    return;
  }

  bar.style.display =
    totalItems === 0
      ? "none"
      : "flex";

  const countElement =
    document.getElementById(
      "cart-count"
    );

  const totalElement =
    document.getElementById(
      "cart-total"
    );

  if (countElement) {
    countElement.textContent =
      `${totalItems} item(s) in cart`;
  }

  if (totalElement) {
    totalElement.textContent =
      `$${totalPrice.toFixed(2)}`;
  }
}


// ========================
// OPEN CART PAGE
// Navigate to the shopping cart page
// ========================

function goToCart() {
  window.location.href =
    "./cart.html";
}


// ========================
// OPEN IMAGE MODAL
// Display the selected product image
// ========================

function openModal(img) {
  const modal =
    document.getElementById(
      "imageModal"
    );

  const modalImg =
    document.getElementById(
      "modalImg"
    );

  if (!modal || !modalImg) {
    return;
  }

  modal.style.display = "block";
  modalImg.src = img.src;
}


// ========================
// CLOSE IMAGE MODAL
// Hide the product image modal
// ========================

function closeModal() {
  const modal =
    document.getElementById(
      "imageModal"
    );

  if (modal) {
    modal.style.display = "none";
  }
}


// ========================
// MODAL OUTSIDE CLICK
// Close the modal when its background is clicked
// ========================

window.addEventListener(
  "click",
  (event) => {
    const modal =
      document.getElementById(
        "imageModal"
      );

    if (
      modal &&
      event.target === modal
    ) {
      modal.style.display =
        "none";
    }
  }
);


// ========================
// PRODUCT CART QUANTITY
// Get the total cart quantity for one product
// ========================

function getCartQty(productId) {
  const cart =
    JSON.parse(
      localStorage.getItem(
        "sushibakeCart"
      )
    ) || [];

  let total = 0;

  cart.forEach((item) => {
    if (item.id === productId) {
      total += item.qty;
    }
  });

  return total;
}


// ========================
// UPDATE MENU ITEM
// Display the cart quantity for one menu item
// ========================

function updateMenuItem(productId) {
  const qty =
    getCartQty(productId);

  const count =
    document.getElementById(
      `${productId}-count`
    );

  const button =
    document.querySelector(
      `#${productId}-qty-container button`
    );

  if (!count || !button) {
    return;
  }

  count.textContent = qty;

  button.onclick = () => {
    goToProduct(productId);
  };
}


// ========================
// UPDATE MENU QUANTITIES
// Refresh all product quantities on the menu
// ========================

function updateMenuQuantities() {
  const cart =
    JSON.parse(
      localStorage.getItem("sushibakeCart")
    ) || [];

  const productIds =
    Object.keys(PRODUCTS);

  productIds.forEach((productId) => {
    const totalQty = cart
      .filter(
        (item) =>
          item.id === productId
      )
      .reduce(
        (total, item) =>
          total + Number(item.qty || 0),
        0
      );

    const countElement =
      document.getElementById(
        `${productId}-count`
      );

    if (countElement) {
      countElement.textContent =
        totalQty;
    }
  });
}


// ========================
// WEEKDAY CHECK
// Check whether a date is Monday to Friday
// ========================

function isWeekday(date) {
  const day = date.getDay();

  return day >= 1 && day <= 5;
}


// ========================
// NEXT CUTOFF INFORMATION
// Calculate the next available order cutoff
// ========================

function getNextCutoffInfo() {
  const now = new Date();

  const orderOpenDate =
    new Date(
      2026,
      4,
      8,
      0,
      0,
      0,
      0
    );

  const firstDeliveryDate =
    new Date(
      2026,
      4,
      11,
      0,
      0,
      0,
      0
    );

  const cutoffHour = 20;

  if (now < orderOpenDate) {
    return {
      status: "notOpen"
    };
  }

  let orderDate =
    new Date(
      firstDeliveryDate
    );

  while (
    orderDate <= now ||
    !isWeekday(orderDate)
  ) {
    orderDate.setDate(
      orderDate.getDate() + 1
    );
  }

  let cutoffDate =
    new Date(orderDate);

  cutoffDate.setDate(
    orderDate.getDate() - 1
  );

  cutoffDate.setHours(
    cutoffHour,
    0,
    0,
    0
  );

  if (now > cutoffDate) {
    orderDate.setDate(
      orderDate.getDate() + 1
    );

    while (
      !isWeekday(orderDate)
    ) {
      orderDate.setDate(
        orderDate.getDate() + 1
      );
    }

    cutoffDate =
      new Date(orderDate);

    cutoffDate.setDate(
      orderDate.getDate() - 1
    );

    cutoffDate.setHours(
      cutoffHour,
      0,
      0,
      0
    );
  }

  const orderLabel =
    orderDate.toLocaleDateString(
      "en-SG",
      {
        weekday: "long",
        day: "numeric",
        month: "short"
      }
    );

  return {
    status: "open",
    cutoffDate,
    label: `${orderLabel} orders`
  };
}


// ========================
// FORMAT COUNTDOWN
// Convert milliseconds into a countdown label
// ========================

function formatCountdown(ms) {
  const safeMilliseconds =
    Math.max(ms, 0);

  const totalSeconds =
    Math.floor(
      safeMilliseconds / 1000
    );

  const days =
    Math.floor(
      totalSeconds /
      (60 * 60 * 24)
    );

  const hours =
    Math.floor(
      (
        totalSeconds %
        (60 * 60 * 24)
      ) /
      (60 * 60)
    );

  const minutes =
    Math.floor(
      (
        totalSeconds %
        (60 * 60)
      ) /
      60
    );

  const seconds =
    totalSeconds % 60;

  return (
    `${days}D ` +
    `${hours}H ` +
    `${minutes}M ` +
    `${seconds}S`
  );
}


// ========================
// CUTOFF BANNER TEXT
// Create the current order cutoff message
// ========================

function getNextCutoffText() {
  const now = new Date();

  const cutoffInfo =
    getNextCutoffInfo();

  if (
    cutoffInfo.status ===
    "notOpen"
  ) {
    return {
      text:
        "⏰ May Drops orders open 8 May" +
        "<br>" +
        '<span class="big-time">' +
        "Deliveries from 11 May" +
        "</span>",

      urgent: false
    };
  }

  const {
    cutoffDate,
    label
  } = cutoffInfo;

  const difference =
    cutoffDate - now;

  return {
    text:
      `⚡ Closing ${label} in` +
      "<br>" +
      '<span class="big-time">' +
      `${formatCountdown(difference)}` +
      "</span>",

    urgent: true
  };
}


// ========================
// UPDATE CUTOFF BANNER
// Refresh the order cutoff banner display
// ========================

function updateCutoffBanner() {
  const banner =
    document.getElementById(
      "cutoff-banner"
    );

  const textElement =
    document.getElementById(
      "cutoff-text"
    );

  if (!banner || !textElement) {
    return;
  }

  const result =
    getNextCutoffText();

  textElement.innerHTML =
    result.text;

  banner.classList.toggle(
    "urgent",
    result.urgent
  );

  banner.classList.toggle(
    "ticking",
    result.urgent
  );
}


// ========================
// INITIALISE MENU PAGE
// Load menu quantities, cart bar and cutoff banner
// ========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    updateMenuQuantities();
    updateCartBar();
    updateCutoffBanner();

    setInterval(
      updateCutoffBanner,
      1000
    );
  }
);