// ================================================
// Restore edit mode selections
// ================================================


// ========================
// NORMAL PRODUCT SELECTIONS
// Restore removed ingredients, base and portion
// ========================

function restoreNormalProductSelections() {
  if (!editingItem) {
    return;
  }

  document
    .querySelectorAll(
      ".remove-option"
    )
    .forEach((checkbox) => {
      checkbox.checked =
        !editingItem.removed?.includes(
          checkbox.value
        );
    });

  restoreRadioSelection(
    "base",
    editingItem.base
  );

  restoreRadioSelection(
    "portion",
    editingItem.portion
  );
}


// ========================
// DOUBLE-UP SELECTIONS
// Restore Double-Up flavours and base
// ========================

function restoreDoubleUpSelections() {
  if (
    !editingItem ||
    !Array.isArray(
      editingItem.flavours
    )
  ) {
    return;
  }

  const firstSelect =
    document.getElementById(
      "doubleup-flavour-1"
    );

  const secondSelect =
    document.getElementById(
      "doubleup-flavour-2"
    );

  const firstFlavour =
    editingItem.flavours[0];

  const secondFlavour =
    editingItem.flavours[1];

  if (
    firstSelect &&
    firstFlavour?.id
  ) {
    firstSelect.value =
      firstFlavour.id;
  }

  if (
    secondSelect &&
    secondFlavour?.id
  ) {
    secondSelect.value =
      secondFlavour.id;
  }

  restoreRadioSelection(
    "base",
    editingItem.base
  );
}


// ========================
// TRIO SELECTIONS
// Restore all saved Trio tray options
// ========================

function restoreTrioSelections() {
  if (
    !editingItem ||
    !Array.isArray(
      editingItem.trays
    )
  ) {
    return;
  }

  editingItem.trays.forEach(
    (tray, trayIndex) => {
      restoreTrioTraySelection(
        tray,
        trayIndex
      );
    }
  );

  updateTrioFlavourLimits();
  validateTrioSelection();
  updateTrioSaving();
}


// ========================
// TRIO TRAY SELECTION
// Restore one Trio tray's flavour and options
// ========================

function restoreTrioTraySelection(
  tray,
  trayIndex
) {
  const flavourSelect =
    document.querySelector(
      `.trio-flavour` +
      `[data-tray-index="${trayIndex}"]`
    );

  if (
    !flavourSelect ||
    !tray?.productId
  ) {
    return;
  }

  flavourSelect.value =
    tray.productId;

  renderTrioTrayOptions(
    trayIndex,
    tray.productId
  );

  restoreTrioRemovedIngredients(
    tray,
    trayIndex
  );

  restoreRadioSelection(
    `trio-base-${trayIndex}`,
    tray.base
  );

  restoreRadioSelection(
    `trio-portion-${trayIndex}`,
    tray.portion
  );
}


// ========================
// TRIO REMOVED INGREDIENTS
// Restore removed ingredients for one Trio tray
// ========================

function restoreTrioRemovedIngredients(
  tray,
  trayIndex
) {
  const removed =
    Array.isArray(tray.removed)
      ? tray.removed
      : [];

  document
    .querySelectorAll(
      `.trio-remove-option` +
      `[data-tray-index="${trayIndex}"]`
    )
    .forEach((checkbox) => {
      checkbox.checked =
        !removed.includes(
          checkbox.value
        );
    });
}


// ========================
// UPGRADE SELECTION
// Restore the saved upgrade option
// ========================

function restoreUpgradeSelection() {
  if (
    !editingItem ||
    !editingItem.upgrade
  ) {
    return;
  }

  restoreRadioSelection(
    "upgrade",
    editingItem.upgrade
  );
}


// ========================
// RADIO SELECTION
// Restore a saved radio button value
// ========================

function restoreRadioSelection(
  name,
  value
) {
  if (!value) {
    return;
  }

  document
    .querySelectorAll(
      `input[name="${name}"]`
    )
    .forEach((radio) => {
      radio.checked =
        radio.value === value;
    });
}


// ========================
// EDIT MODE SELECTIONS
// Restore all saved selections for the edited item
// ========================

function restoreEditSelections() {
  if (!editingItem) {
    return;
  }

  if (instructionsInput) {
    instructionsInput.value =
      editingItem.instructions || "";
  }

  if (product.id === "trio") {
    restoreTrioSelections();
  } else if (
    product.id === "doubleup"
  ) {
    restoreDoubleUpSelections();
  } else {
    restoreNormalProductSelections();
  }

  restoreUpgradeSelection();

  updatePrice();
}