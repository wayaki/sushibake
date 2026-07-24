// ================================================
// Cart data, quantity changes and cart management
// ================================================


// ========================
// LOAD SAVED CART
// Retrieve saved cart data from localStorage
// ========================

let cart =
  JSON.parse(
    localStorage.getItem("sushibakeCart")
  ) || [];


// ========================
// CHECK CART ITEMS
// Check whether the cart contains any items
// ========================

function hasCartItems() {
  return cart.length > 0;
}


// ========================
// SAVE CART
// Save the latest cart data to localStorage
// ========================

function saveCart() {
  localStorage.setItem(
    "sushibakeCart",
    JSON.stringify(cart)
  );
}


// ========================
// CHANGE CART QUANTITY
// Increase, decrease or remove a cart item
// ========================

function changeCartQty(index, delta) {
  const item = cart[index];

  if (!item) {
    return;
  }

  const unitPrice = Number(
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

  saveCart();

  renderCart();
  toggleDelivery();
}


// ========================
// EDIT CART ITEM
// Open the product page in edit mode
// ========================

function editCartItem(index) {
  const item = cart[index];

  if (!item) {
    return;
  }

  window.location.href =
    `product.html?item=${item.id}&edit=${index}`;
}


// ========================
// COUNT MAIN TRAYS
// Calculate the total number of main trays
// ========================

function getTotalMainTrays() {
  const mainProducts = [
    "salmon",
    "shroom",
    "tuna",
    "chicken",
    "luncheon"
  ];

  return cart.reduce((total, item) => {
    if (item.id === "trio") {
      return total + item.qty * 3;
    }

    if (item.id === "doubleup") {
      return total + item.qty;
    }

    if (mainProducts.includes(item.id)) {
      return total + item.qty;
    }

    return total;
  }, 0);
}