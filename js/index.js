function goToProduct(itemId) {
  window.location.href = `product.html?item=${itemId}`;
}

// update bottom cart bar
function updateCartBar() {
  const cart = JSON.parse(localStorage.getItem("sushibakeCart")) || [];

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.qty;
    totalPrice += item.finalPrice;
  });

  const bar = document.getElementById("cartBar");

  if (totalItems === 0) {
    bar.style.display = "none";
  } else {
    bar.style.display = "flex";
  }

  document.getElementById("cart-count").textContent =
    `${totalItems} item(s) in cart`;

  document.getElementById("cart-total").textContent =
    `$${totalPrice.toFixed(2)}`;
}

// go to cart page
function goToCart() {
  window.location.href = "./cart.html";
}

// open image modal
function openModal(img) {
  // modal container
  const modal = document.getElementById("imageModal");
  // modal image
  const modalImg = document.getElementById("modalImg");

  // show modal
  modal.style.display = "block";
  // set clicked image
  modalImg.src = img.src;
}

function getCartQty(productId) {
  const cart =
    JSON.parse(localStorage.getItem("sushibakeCart")) || [];

  let total = 0;

  cart.forEach(item => {
    if (item.id === productId) {
      total += item.qty;
    }
  });

  return total;
}

function updateMenuItem(productId) {
  const qty = getCartQty(productId);

  const container =
    document.getElementById(`${productId}-qty-container`);

  if (!container) return;

  if (qty === 0) {
    container.innerHTML = `
      <button onclick="goToProduct('${productId}')">+</button>
    `;
  } else {
    container.innerHTML = `
      <button onclick="goToCart()">−</button>
      <span>${qty}</span>
      <button onclick="goToProduct('${productId}')">+</button>
    `;
  }
}

function updateMenuQuantities() {
  updateMenuItem("salmon");
  updateMenuItem("shroom");
  updateMenuItem("chicken");
  updateMenuItem("tuna");
}

document.addEventListener("DOMContentLoaded", () => {
  updateMenuQuantities();
  updateCartBar();
});

// close image modal
function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// close modal when clicking outside image
window.onclick = function (event) {
  const modal = document.getElementById("imageModal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// get next order cutoff information
function getNextCutoffInfo() {
  // current date and time
  const now = new Date();
  // May Drops opening date
  const orderOpenDate = new Date(2026, 4, 8, 0, 0, 0, 0); // 8 May
  // first delivery date
  const firstDeliveryDate = new Date(2026, 4, 11, 0, 0, 0, 0); // 11 May
  // cutoff time is 7PM
  const cutoffHour = 20; // 7PM

  // before orders open
  if (now < orderOpenDate) {
    return { status: "notOpen" };
  }

  // check if date is Monday to Friday
  function isWeekday(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Mon-Fri
  }

  // start checking from first delivery date
  let orderDate = new Date(firstDeliveryDate);

  // skip past dates and weekends
  while (orderDate <= now || !isWeekday(orderDate)) {
    orderDate.setDate(orderDate.getDate() + 1);
  }

  // set cutoff date to 1 day before order date
  let cutoffDate = new Date(orderDate);
  cutoffDate.setDate(orderDate.getDate() - 1);
  cutoffDate.setHours(cutoffHour, 0, 0, 0);

  // if cutoff already passed, move to next weekday
  if (now > cutoffDate) {
    orderDate.setDate(orderDate.getDate() + 1);

    // skip weekends
    while (!isWeekday(orderDate)) {
      orderDate.setDate(orderDate.getDate() + 1);
    }

    // update new cutoff date
    cutoffDate = new Date(orderDate);
    cutoffDate.setDate(orderDate.getDate() - 1);
    cutoffDate.setHours(cutoffHour, 0, 0, 0);
  }

  // format order date label
  const orderLabel = orderDate.toLocaleDateString("en-SG", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  // return cutoff information
  return {
    status: "open",
    cutoffDate,
    label: `${orderLabel} orders`,
  };
}

// format countdown timer
function formatCountdown(ms) {
  // convert milliseconds to seconds
  const totalSeconds = Math.floor(ms / 1000);

  // calculate days, hours, mins, secs
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  // return countdown text
  return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

// get cutoff banner text
function getNextCutoffText() {
  // current date and time
  const now = new Date();
  // get next cutoff information
  const cutoffInfo = getNextCutoffInfo();

  // before orders open
  if (cutoffInfo.status === "notOpen") {
    return {
      text: `⏰ May Drops orders open 8 May <br><span class="big-time">Deliveries from 11 May</span>`,
      urgent: false,
    };
  }

  // get cutoff date and order label and remaining time
  const { cutoffDate, label } = cutoffInfo;
  const diff = cutoffDate - now;

  // return active countdown text
  return {
    text: `⚡ Closing ${label} in <br><span class="big-time">${formatCountdown(diff)}`,
    urgent: true,
  };
}

// update cutoff banner on page
function updateCutoffBanner() {
  // banner container and text
  const banner = document.getElementById("cutoff-banner");
  const textEl = document.getElementById("cutoff-text");

  // stop if banner does not exist
  if (!banner || !textEl) return;

  // get updated banner text
  const result = getNextCutoffText();
  // display banner text
  textEl.innerHTML = result.text;

  // add urgent animation if orders are open
  if (result.urgent) {
    banner.classList.add("urgent", "ticking");
  } else {
    // remove urgent animation before orders open
    banner.classList.remove("urgent", "ticking");
  }
}

updateCutoffBanner();
setInterval(updateCutoffBanner, 1000);
updateCartBar();
