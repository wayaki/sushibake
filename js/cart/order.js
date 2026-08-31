// ================================================
// Cart → Checkout
// ================================================


// ========================
// GO TO CHECKOUT
// ========================

function goToCheckout() {
  if (!cart || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  window.location.href =
    "./checkout.html";
}


// ========================
// CONTINUE BUTTON
// ========================

const checkoutButton =
  document.getElementById(
    "checkout-btn"
  );


if (checkoutButton) {
  checkoutButton.addEventListener(
    "click",
    goToCheckout
  );
}