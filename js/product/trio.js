// ================================================
// WAYAKI TRIO customisation
// ================================================


// ========================
// TRIO SECTIONS
// Render the Trio customisation layout
// ========================

function renderTrioSections() {
  showSection(flavourSection);

  flavourContainer.innerHTML = "";

  // Trio has its own options inside each tray
  hideSection(removeSection);
  hideSection(baseSection);
  hideSection(portionSection);

  const title =
    document.getElementById(
      "flavour-section-title"
    );

  const description =
    document.getElementById(
      "flavour-section-desc"
    );

  if (title) {
    title.textContent =
      "Build Your Wayaki Trio";
  }

  if (description) {
    description.textContent =
      "Choose 3 different flavours and customise each tray.";
  }

  for (
    let trayIndex = 0;
    trayIndex < 3;
    trayIndex++
  ) {
    const tray =
      document.createElement("div");

    tray.className =
      "trio-tray-section";

    tray.dataset.trayIndex =
      trayIndex;

    tray.innerHTML = `
      <h4>
        Tray ${trayIndex + 1}
      </h4>

      <div class="option">
        <label
          for="trio-flavour-${trayIndex}"
        >
          Flavour
        </label>

        <select
          id="trio-flavour-${trayIndex}"
          class="trio-flavour"
          data-tray-index="${trayIndex}"
        >
          <option value="">
            Choose flavour
          </option>

          ${renderTrioFlavourOptions()}
        </select>
      </div>

      <div
        class="trio-tray-options"
        id="trio-tray-options-${trayIndex}"
      ></div>
    `;

    flavourContainer.appendChild(
      tray
    );
  }

  document
    .querySelectorAll(
      ".trio-flavour"
    )
    .forEach((select) => {
      select.addEventListener(
        "change",
        handleTrioFlavourChange
      );
    });

  actionBtn.disabled = true;

  validateTrioSelection();
}


// ========================
// TRIO FLAVOUR OPTIONS
// Render the available Trio flavour choices
// ========================

function renderTrioFlavourOptions() {
  if (
    !Array.isArray(
      product.flavourOptions
    )
  ) {
    return "";
  }

  return product.flavourOptions
    .map((option) => {
      const flavourProduct =
        PRODUCTS[
          option.productId
        ];

      if (!flavourProduct) {
        return "";
      }

      return `
        <option
          value="${option.productId}"
          data-price="${flavourProduct.price}"
        >
          ${flavourProduct.name}
        </option>
      `;
    })
    .join("");
}


// ========================
// HANDLE FLAVOUR CHANGE
// Update one Trio tray after changing its flavour
// ========================

function handleTrioFlavourChange(
  event
) {
  const select =
    event.currentTarget;

  const trayIndex =
    Number(
      select.dataset.trayIndex
    );

  renderTrioTrayOptions(
    trayIndex,
    select.value
  );

  updateTrioFlavourLimits();
  validateTrioSelection();
  updateTrioSaving();
  updatePrice();
}


// ========================
// TRIO TRAY OPTIONS
// Render the options for a selected Trio tray
// ========================

function renderTrioTrayOptions(
  trayIndex,
  selectedProductId
) {
  const container =
    document.getElementById(
      `trio-tray-options-${trayIndex}`
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!selectedProductId) {
    return;
  }

  const selectedProduct =
    PRODUCTS[selectedProductId];

  if (!selectedProduct) {
    return;
  }

  const removeOptionsHTML =
    renderTrioRemoveOptions(
      selectedProduct,
      trayIndex
    );

  const baseOptionsHTML =
    renderTrioBaseOptions(
      selectedProduct,
      trayIndex
    );

  const portionOptionsHTML =
    renderTrioPortionOptions(
      selectedProduct,
      trayIndex
    );

  container.innerHTML = `
    <div class="trio-subsection">
      <h5>
        Remove Ingredients
      </h5>

      ${removeOptionsHTML}
    </div>

    <div class="trio-subsection">
      <h5>
        Choose Your Base
      </h5>

      ${baseOptionsHTML}
    </div>

    <div class="trio-subsection">
      <h5>
        Portion Preference
      </h5>

      ${portionOptionsHTML}
    </div>
  `;

  container
    .querySelectorAll(
      ".trio-base-option, " +
      ".trio-portion-option"
    )
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// REMOVE OPTIONS
// Render removable ingredients for one Trio tray
// ========================

function renderTrioRemoveOptions(
  selectedProduct,
  trayIndex
) {
  const removable =
    selectedProduct.removable || [];

  if (removable.length === 0) {
    return `
      <p class="empty-option-text">
        No removable ingredients
      </p>
    `;
  }

  return removable
    .map((ingredient) => {
      return `
        <div class="option">
          <label>
            <input
              type="checkbox"
              class="trio-remove-option"
              data-tray-index="${trayIndex}"
              value="${ingredient}"
              checked
            >

            ${ingredient}
          </label>
        </div>
      `;
    })
    .join("");
}


// ========================
// BASE OPTIONS
// Render base choices for one Trio tray
// ========================

function renderTrioBaseOptions(
  selectedProduct,
  trayIndex
) {
  const baseOptions =
    selectedProduct.baseOptions ||
    [];

  if (baseOptions.length === 0) {
    return `
      <p class="empty-option-text">
        No base options available
      </p>
    `;
  }

  return baseOptions
    .map((option, index) => {
      const extraPrice =
        Number(option.price || 0);

      return `
        <div class="option">
          <label>
            <input
              type="radio"
              name="trio-base-${trayIndex}"
              class="trio-base-option"
              value="${option.name}"
              data-price="${extraPrice}"
              ${
                index === 0
                  ? "checked"
                  : ""
              }
            >

            ${option.name}

            ${
              option.subtitle
                ? `
                  <small class="option-subtitle">
                    ${option.subtitle}
                  </small>
                `
                : ""
            }
          </label>

          <span>
            ${
              extraPrice > 0
                ? `+$${extraPrice.toFixed(2)}`
                : ""
            }
          </span>
        </div>
      `;
    })
    .join("");
}


// ========================
// PORTION OPTIONS
// Render portion choices for one Trio tray
// ========================

function renderTrioPortionOptions(
  selectedProduct,
  trayIndex
) {
  const portionOptions =
    selectedProduct.portionOptions ||
    [];

  if (portionOptions.length === 0) {
    return `
      <p class="empty-option-text">
        No portion options available
      </p>
    `;
  }

  return portionOptions
    .map((option, index) => {
      const extraPrice =
        Number(option.price || 0);

      return `
        <div class="option">
          <label>
            <input
              type="radio"
              name="trio-portion-${trayIndex}"
              class="trio-portion-option"
              value="${option.name}"
              data-price="${extraPrice}"
              ${
                index === 0
                  ? "checked"
                  : ""
              }
            >

            ${option.name}
          </label>

          <span>
            ${
              extraPrice > 0
                ? `+$${extraPrice.toFixed(2)}`
                : ""
            }
          </span>
        </div>
      `;
    })
    .join("");
}


// ========================
// FLAVOUR LIMITS
// Prevent duplicate flavour selections
// ========================

function updateTrioFlavourLimits() {
  const selects = [
    ...document.querySelectorAll(
      ".trio-flavour"
    )
  ];

  const selectedValues =
    selects
      .map((select) =>
        select.value
      )
      .filter(Boolean);

  selects.forEach((select) => {
    const currentValue =
      select.value;

    Array.from(
      select.options
    ).forEach((option) => {
      if (!option.value) {
        return;
      }

      const selectedElsewhere =
        selectedValues.includes(
          option.value
        );

      const isCurrentSelection =
        option.value ===
        currentValue;

      option.disabled =
        selectedElsewhere &&
        !isCurrentSelection;
    });
  });
}


// ========================
// VALIDATE TRIO
// Ensure three different flavours are selected
// ========================

function validateTrioSelection() {
  if (product.id !== "trio") {
    return true;
  }

  const values = [
    ...document.querySelectorAll(
      ".trio-flavour"
    )
  ]
    .map((select) =>
      select.value
    )
    .filter(Boolean);

  const hasThreeFlavours =
    values.length === 3;

  const hasUniqueFlavours =
    new Set(values).size === 3;

  const isValid =
    hasThreeFlavours &&
    hasUniqueFlavours;

  actionBtn.disabled =
    !isValid;

  if (!isValid) {
    actionBtn.textContent =
      "Choose 3 Different Flavours First";
  }

  return isValid;
}


// ========================
// TRIO SAVINGS
// Display the original price before bundle savings
// ========================

function updateTrioSaving() {
  if (product.id !== "trio") {
    return;
  }

  const originalPriceBox =
    document.getElementById(
      "original-price"
    );

  if (!originalPriceBox) {
    return;
  }

  const selects =
    document.querySelectorAll(
      ".trio-flavour"
    );

  let originalTotal = 0;
  let selectedCount = 0;

  selects.forEach((select) => {
    const selectedOption =
      select.options[
        select.selectedIndex
      ];

    const selectedPrice =
      selectedOption
        ?.dataset.price;

    if (
      selectedOption?.value &&
      selectedPrice !== undefined
    ) {
      originalTotal +=
        Number(selectedPrice);

      selectedCount++;
    }
  });

  if (selectedCount === 3) {
    originalPriceBox.textContent =
      `$${originalTotal.toFixed(2)}`;

    originalPriceBox.style.display =
      "inline";
  } else {
    originalPriceBox.textContent = "";

    originalPriceBox.style.display =
      "none";
  }
}


// ========================
// TRIO SELECTIONS
// Collect all customised Trio tray selections
// ========================

function getTrioSelections() {
  const trays = [];

  for (
    let trayIndex = 0;
    trayIndex < 3;
    trayIndex++
  ) {
    const flavourSelect =
      document.querySelector(
        `.trio-flavour` +
        `[data-tray-index="${trayIndex}"]`
      );

    const selectedProductId =
      flavourSelect?.value;

    if (!selectedProductId) {
      return null;
    }

    const selectedProduct =
      PRODUCTS[
        selectedProductId
      ];

    if (!selectedProduct) {
      return null;
    }

    const selectedBase =
      document.querySelector(
        `input[name="trio-base-${trayIndex}"]:checked`
      );

    const selectedPortion =
      document.querySelector(
        `input[name="trio-portion-${trayIndex}"]:checked`
      );

    const removed = [];

    document
      .querySelectorAll(
        `.trio-remove-option` +
        `[data-tray-index="${trayIndex}"]`
      )
      .forEach((checkbox) => {
        if (!checkbox.checked) {
          removed.push(
            checkbox.value
          );
        }
      });

    trays.push({
      trayNumber:
        trayIndex + 1,

      productId:
        selectedProductId,

      flavour:
        selectedProduct.name,

      base:
        selectedBase?.value || "",

      portion:
        selectedPortion?.value || "",

      removed
    });
  }

  return trays;
}