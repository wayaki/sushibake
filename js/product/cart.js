// ================================================
// Add and update cart items
// ================================================


// ========================
// SAVE PRODUCT CART
// Save product cart items to local storage
// ========================

function saveProductCart(cart) {
  localStorage.setItem(
    "sushibakeCart",
    JSON.stringify(cart)
  );
}


// ========================
// ADD TO CART
// Validate selections and save the product to cart
// ========================

function addToCart() {
  const cart =
    JSON.parse(localStorage.getItem("sushibakeCart")) || [];

  if (
    product.id === "double_up" &&
    !validateDoubleUpSelection()
  ) {
    alert(
      "Please choose a flavour for both halves."
    );

    return;
  }

  if (
    product.id === "wayaki_trio" &&
    !validateTrioSelection()
  ) {
    alert(
      "Please choose 3 different flavours."
    );

    return;
  }

  const selectedUpgrade =
    document.querySelector(
      'input[name="upgrade"]:checked'
    );

  const upgrade =
    selectedUpgrade?.value || "";

  const upgradePrice =
    Number(
      selectedUpgrade
        ?.dataset.price || 0
    );

  const unitPrice =
    calculateUnitPrice();

  const finalPrice =
    unitPrice * quantity;

  const cartItem = {
    id: product.id,
    name: product.name,
    image: product.image,

    qty: quantity,
    basePrice: product.price,
    unitPrice,
    finalPrice,

    instructions:
      instructionsInput.value.trim(),

    upgrade,
    upgradePrice
  };

  if (product.id === "wayaki_trio") {
    cartItem.trays =
      getTrioSelections();
  } else if (
    product.id === "double_up"
  ) {
    cartItem.flavours =
      getDoubleUpSelections();

    cartItem.base =
      getSelectedRadioValue(
        "base"
      );

    cartItem.portion = "";
  } else {
    const removed = [];

    document
      .querySelectorAll(
        ".remove-option"
      )
      .forEach((checkbox) => {
        if (!checkbox.checked) {
          removed.push(
            checkbox.value
          );
        }
      });

    cartItem.removed =
      removed;

    cartItem.base =
      getSelectedRadioValue(
        "base"
      );

    cartItem.portion =
      getSelectedRadioValue(
        "portion"
      );

    cartItem.spiciness =
      getSelectedRadioValue(
        "spiciness"
      );
  }

  if (editIndex !== null) {
    cart[Number(editIndex)] =
      cartItem;
  } else {
    cart.push(cartItem);
  }

  saveProductCart(cart);

  window.location.href =
    "./cart.html";
}