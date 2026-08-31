// ================================================
// Render cart items and cart display
// ================================================


// ========================
// TRIO TRAY DETAILS
// Render the selected options for each Trio tray
// ========================

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
            Tray ${tray.trayNumber}:
            ${tray.flavour}
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


// ========================
// NORMAL PRODUCT DETAILS
// Render the selected options for a normal product
// ========================

function renderNormalProductDetails(item) {
  return `
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
  `;
}


// ========================
// DOUBLE-UP DETAILS
// Render the selected flavours and base for Double-Up
// ========================

function renderDoubleUpDetails(item) {
  const firstFlavour =
    item.flavours?.[0]?.name || "";

  const secondFlavour =
    item.flavours?.[1]?.name || "";

  return `
    <div class="cart-note">
      Flavours:
      ${firstFlavour}
      +
      ${secondFlavour}
    </div>

    <div class="cart-note">
      Base: ${item.base || ""}
    </div>
  `;
}


// ========================
// UPGRADE DETAILS
// Render the selected upgrade option
// ========================

function renderUpgradeDetails(item) {
  if (
    !item.upgrade ||
    item.upgrade === "No Upgrade"
  ) {
    return "";
  }

  return `
    <div class="cart-note">
      ${item.upgrade}
    </div>
  `;
}


// ========================
// INSTRUCTIONS DETAILS
// Render the customer's special instructions
// ========================

function renderInstructionsDetails(item) {
  if (!item.instructions) {
    return "";
  }

  return `
    <div class="cart-note">
      Note: ${item.instructions}
    </div>
  `;
}


// ========================
// FREE SEAWEED DETAILS
// Render the number of free seaweed sheets included
// ========================

function renderFreeSeaweedDetails(item) {
  if (item.id === "trio") {
    return `
      <div class="free-seaweed-line">
        🎁 Free ${item.qty * 3} seaweed
      </div>
    `;
  }

  if (item.id === "doubleup") {
    return `
      <div class="free-seaweed-line">
        🎁 Free ${item.qty * 2} seaweed
      </div>
    `;
  }

  const productsWithSeaweed = [
    "salmon",
    "shroom",
    "chicken",
    "tuna",
    "luncheon"
  ];

  if (productsWithSeaweed.includes(item.id)) {
    return `
      <div class="free-seaweed-line">
        🎁 Free ${item.qty} seaweed
      </div>
    `;
  }

  return "";
}


// ========================
// CART ITEM
// Render one complete cart item
// ========================

function renderCartItem(item, index) {
  let productDetails = "";

  if (item.id === "trio") {
    productDetails =
      renderTrioTrayDetails(item);
  } else if (item.id === "doubleup") {
    productDetails =
      renderDoubleUpDetails(item);
  } else {
    productDetails =
      renderNormalProductDetails(item);
  }

  return `
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

          ${productDetails}

          ${renderUpgradeDetails(item)}

          ${renderInstructionsDetails(item)}

          ${renderFreeSeaweedDetails(item)}

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

          $${Number(
            item.finalPrice
          ).toFixed(2)}

        </div>
      </div>
    </li>
  `;
}

// ========================
// CART Update Subtotal
// Update the subtotal
// ========================

function updateSubtotal() {
  const subtotalElement =
    document.getElementById(
      "subtotal-price"
    );

  if (!subtotalElement) {
    return;
  }

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.finalPrice || 0),
      0
    );

  subtotalElement.textContent =
    subtotal.toFixed(2);
}


// ========================
// CART DISPLAY
// Render all cart items and update the totals
// ========================

function renderCart() {
  const cartList =
    document.getElementById(
      "cart-list"
    );

  if (cart.length === 0) {
    cartList.innerHTML =
      "<li>Your cart is empty!</li>";

    updateSubtotal();
    return;
  }

  const itemsHtml = cart
    .map((item, index) =>
      renderCartItem(item, index)
    )
    .join("");

  cartList.innerHTML = `
    ${itemsHtml}

    <li class="cart-block add-more-block">
      <a
        href="https://wayaki.github.io/sushibake/"
        class="add-more-link"
      >
        + Add More Items
      </a>
    </li>
  `;

  updateSubtotal();
}