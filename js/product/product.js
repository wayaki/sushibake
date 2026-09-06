// ================================================
// Product page setup and shared helpers
// ================================================


// ========================
// URL + PRODUCT SETUP
// Get the product and edit information from the URL
// ========================

const params =
  new URLSearchParams(
    window.location.search
  );

const itemId =
  params.get("item");

const editIndex =
  params.get("edit");

const product =
  PRODUCTS[itemId];

if (!product) {
  alert("Product not found.");

  window.location.href =
    "https://wayaki.github.io/sushibake/";

  throw new Error(
    `Product not found: ${itemId}`
  );
}


// ========================
// HTML ELEMENTS
// Get the product page elements used by the scripts
// ========================

const actionBtn =
  document.getElementById(
    "cart-action-btn"
  );

const flavourSection =
  document.getElementById(
    "flavour-section"
  );

const flavourContainer =
  document.getElementById(
    "flavour-options"
  );

const removeSection =
  document.getElementById(
    "remove-section"
  );

const removeContainer =
  document.getElementById(
    "remove-options"
  );

const spicinessSection =
  document.getElementById(
    "spiciness-section"
  );

const spicinessContainer =
  document.getElementById(
    "spiciness-options"
  );

const baseSection =
  document.getElementById(
    "base-section"
  );

const baseContainer =
  document.getElementById(
    "base-options"
  );

const portionSection =
  document.getElementById(
    "portion-section"
  );

const portionContainer =
  document.getElementById(
    "portion-options"
  );

const includeSection =
  document.getElementById(
    "include-section"
  );

const includeContainer =
  document.getElementById(
    "include-options"
  );

const upgradeSection =
  document.getElementById(
    "upgrade-section"
  );

const upgradeContainer =
  document.getElementById(
    "upgrade-options"
  );

const instructionsInput =
  document.getElementById(
    "instructions"
  );

const qtyElement =
  document.getElementById("qty");


// ========================
// CART + EDIT STATE
// Load the saved cart and current edit mode item
// ========================

let savedCart =
  JSON.parse(
    localStorage.getItem(
      "sushibakeCart"
    )
  );

if (!Array.isArray(savedCart)) {
  savedCart = [];
}

const editingItem =
  editIndex !== null
    ? savedCart[Number(editIndex)]
    : null;

let quantity =
  editingItem?.qty || 1;


// ========================
// PRODUCT INFORMATION
// Display the selected product information
// ========================

document.getElementById(
  "product-image"
).src = product.image;

document.getElementById(
  "product-image"
).alt = product.name;

document.getElementById(
  "product-name"
).textContent = product.name;

document.getElementById(
  "product-desc"
).textContent =
  product.description || "";

const productPriceElement =
  document.getElementById(
    "product-price"
  );

const originalPriceElement =
  document.getElementById(
    "original-price"
  );

productPriceElement.textContent =
  `$${product.price.toFixed(2)}`;

if (
  product.originalPrice &&
  product.originalPrice > product.price
) {
  originalPriceElement.textContent =
    `$${product.originalPrice.toFixed(2)}`;

  originalPriceElement.style.display =
    "inline";
} else {
  originalPriceElement.textContent = "";

  originalPriceElement.style.display =
    "none";
}


qtyElement.textContent =
  quantity;


// ========================
// HIDE SECTION
// Hide a product option section
// ========================

function hideSection(section) {
  if (!section) {
    return;
  }

  section.hidden = true;
  section.style.display = "none";
}


// ========================
// SHOW SECTION
// Show a product option section
// ========================

function showSection(section) {
  if (!section) {
    return;
  }

  section.hidden = false;
  section.style.display = "block";
}


// ========================
// SELECTED RADIO VALUE
// Get the value of a selected radio option
// ========================

function getSelectedRadioValue(
  name
) {
  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );

  return selected?.value || "";
}


// ========================
// SELECTED RADIO PRICE
// Get the additional price of a selected radio option
// ========================

function getSelectedRadioPrice(
  name
) {
  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );

  return Number(
    selected?.dataset.price || 0
  );
}


// ========================
// CHANGE QUANTITY
// Increase or decrease the product quantity
// ========================

function changeQty(delta) {
  quantity += delta;

  if (quantity < 1) {
    quantity = 1;
  }

  qtyElement.textContent =
    quantity;

  updatePrice();
}


// ========================
// CLOSE PRODUCT PAGE
// Return to the previous page
// ========================

function closeProductPage() {
  history.back();
}


// ========================
// INITIALISE PRODUCT PAGE
// Render the correct options for the selected product
// ========================

function initialiseProductPage() {
  hideSection(flavourSection);
  hideSection(removeSection);
  hideSection(spicinessSection);
  hideSection(baseSection);
  hideSection(portionSection);
  hideSection(includeSection);
  hideSection(upgradeSection);

  if (product.id === "wayaki_trio") {
    renderTrioSections();
    renderUpgradeOptions();
  } else if (
    product.id === "double_up"
  ) {
    renderDoubleUpFlavours();
    renderBaseOptions();
    renderUpgradeOptions();
  } else if (
    product.id === "upgrade_set"
  ) {
    renderIncludedItems();
  } else {
    renderRemoveOptions();
    renderSpicinessOptions();
    renderBaseOptions();
    renderPortionOptions();
    renderUpgradeOptions();
  }

  restoreEditSelections();
  updatePrice();
}