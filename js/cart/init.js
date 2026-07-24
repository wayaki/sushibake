// ================================================
// Initialise cart page
// ================================================


// ========================
// INITIALISE CART
// Load the cart page and its default data
// ========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    populateOrderDates();
    renderCart();
    toggleDelivery();
  }
);