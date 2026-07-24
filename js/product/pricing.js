// ================================================
// Product price calculation
// ================================================


// ========================
// UNIT PRICE
// Calculate the price for one customised product
// ========================

function calculateUnitPrice() {
  let unitPrice =
    product.price;

  if (product.id === "doubleup") {
    const firstFlavour =
      document.getElementById(
        "doubleup-flavour-1"
      )?.value;

    const secondFlavour =
      document.getElementById(
        "doubleup-flavour-2"
      )?.value;

    if (
      firstFlavour &&
      secondFlavour
    ) {
      unitPrice =
        getDoubleUpPrice(
          firstFlavour,
          secondFlavour
        );
    }

    unitPrice +=
      getSelectedRadioPrice(
        "base"
      );
  } else if (
    product.id === "trio"
  ) {
    for (
      let trayIndex = 0;
      trayIndex < 3;
      trayIndex++
    ) {
      unitPrice +=
        getSelectedRadioPrice(
          `trio-base-${trayIndex}`
        );

      unitPrice +=
        getSelectedRadioPrice(
          `trio-portion-${trayIndex}`
        );
    }
  } else {
    unitPrice +=
      getSelectedRadioPrice(
        "base"
      );

    unitPrice +=
      getSelectedRadioPrice(
        "portion"
      );
  }

  unitPrice +=
    getSelectedRadioPrice(
      "upgrade"
    );

  return unitPrice;
}


// ========================
// UPDATE PRICE
// Validate selections and update the cart button price
// ========================

function updatePrice() {
  if (
    product.id === "doubleup" &&
    !validateDoubleUpSelection()
  ) {
    actionBtn.disabled = true;

    actionBtn.textContent =
      "Choose Flavours First";

    return;
  }

  if (
    product.id === "trio" &&
    !validateTrioSelection()
  ) {
    return;
  }

  actionBtn.disabled = false;

  const unitPrice =
    calculateUnitPrice();

  const total =
    unitPrice * quantity;

  const actionText =
    editIndex !== null
      ? "Update Cart"
      : "Add To Cart";

  actionBtn.innerHTML =
    `${actionText} — ` +
    `<span id="final-price">` +
    `$${total.toFixed(2)}` +
    `</span>`;
}