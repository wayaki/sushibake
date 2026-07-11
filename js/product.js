// ========================
// URL + PRODUCT SETUP
// ========================

const params = new URLSearchParams(window.location.search);

const itemId = params.get("item");
const editIndex = params.get("edit");

const product = products[itemId];

if (!product) {
  alert("Product not found.");
  window.location.href = "./index.html";

  throw new Error(`Product not found: ${itemId}`);
}


// ========================
// GET HTML ELEMENTS
// ========================

const actionBtn = document.getElementById("cart-action-btn");

const flavourSection =
  document.getElementById("flavour-section");

const flavourContainer =
  document.getElementById("flavour-options");

const removeSection =
  document.getElementById("remove-section");

const removeContainer =
  document.getElementById("remove-options");

const baseSection =
  document.getElementById("base-section");

const baseContainer =
  document.getElementById("base-options");

const portionSection =
  document.getElementById("portion-section");

const portionContainer =
  document.getElementById("portion-options");

const includeSection =
  document.getElementById("include-section");

const includeContainer =
  document.getElementById("include-options");

const upgradeSection =
  document.getElementById("upgrade-section");

const upgradeContainer =
  document.getElementById("upgrade-options");

const instructionsInput =
  document.getElementById("instructions");

const qtyElement =
  document.getElementById("qty");


// ========================
// CART + EDIT MODE
// ========================

let savedCart = JSON.parse(
  localStorage.getItem("sushibakeCart")
);

if (!Array.isArray(savedCart)) {
  savedCart = [];
}

const editingItem =
  editIndex !== null
    ? savedCart[Number(editIndex)]
    : null;

let quantity = editingItem?.qty || 1;


// ========================
// PRODUCT INFORMATION
// ========================

document.getElementById("product-image").src =
  product.image;

document.getElementById("product-image").alt =
  product.name;

document.getElementById("product-name").textContent =
  product.name;

document.getElementById("product-desc").textContent =
  product.description || "";

document.getElementById("product-price").textContent =
  `$${product.price.toFixed(2)}`;

qtyElement.textContent = quantity;


// ========================
// HELPER FUNCTIONS
// ========================

function hideSection(section) {
  if (!section) return;

  section.hidden = true;
  section.style.display = "none";
}

function showSection(section) {
  if (!section) return;

  section.hidden = false;
  section.style.display = "block";
}

function getSelectedRadioValue(name) {
  const selected = document.querySelector(
    `input[name="${name}"]:checked`
  );

  return selected ? selected.value : "";
}

function getSelectedRadioPrice(name) {
  const selected = document.querySelector(
    `input[name="${name}"]:checked`
  );

  return selected
    ? Number(selected.dataset.price || 0)
    : 0;
}


// ========================
// NORMAL PRODUCT
// REMOVE INGREDIENTS
// ========================

function renderRemoveOptions() {
  removeContainer.innerHTML = "";

  if (!product.removable?.length) {
    hideSection(removeSection);
    return;
  }

  showSection(removeSection);

  product.removable.forEach((ingredient) => {
    removeContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="option">
          <label>
            <input
              type="checkbox"
              class="remove-option"
              value="${ingredient}"
              checked
            >

            ${ingredient}
          </label>
        </div>
      `
    );
  });
}


// ========================
// NORMAL PRODUCT
// BASE OPTIONS
// ========================

function renderBaseOptions() {
  baseContainer.innerHTML = "";

  if (!product.baseOptions?.length) {
    hideSection(baseSection);
    return;
  }

  showSection(baseSection);

  product.baseOptions.forEach((option, index) => {
    baseContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="option">
          <label>
            <input
              type="radio"
              name="base"
              value="${option.name}"
              data-price="${option.price}"
              ${index === 0 ? "checked" : ""}
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
              option.price > 0
                ? `+$${option.price.toFixed(2)}`
                : ""
            }
          </span>
        </div>
      `
    );
  });

  document
    .querySelectorAll('input[name="base"]')
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// NORMAL PRODUCT
// PORTION OPTIONS
// ========================

function renderPortionOptions() {
  portionContainer.innerHTML = "";

  if (!product.portionOptions?.length) {
    hideSection(portionSection);
    return;
  }

  showSection(portionSection);

  product.portionOptions.forEach((option, index) => {
    portionContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="option">
          <label>
            <input
              type="radio"
              name="portion"
              value="${option.name}"
              data-price="${option.price}"
              ${index === 0 ? "checked" : ""}
            >

            ${option.name}
          </label>

          <span>
            ${
              option.price > 0
                ? `+$${option.price.toFixed(2)}`
                : ""
            }
          </span>
        </div>
      `
    );
  });

  document
    .querySelectorAll('input[name="portion"]')
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// WAYAKI TRIO
// ========================

function renderTrioSections() {
  showSection(flavourSection);

  flavourContainer.innerHTML = "";

  // Trio has its own options inside each tray
  hideSection(removeSection);
  hideSection(baseSection);
  hideSection(portionSection);

  for (let trayIndex = 0; trayIndex < 3; trayIndex++) {
    const tray = document.createElement("div");

    tray.className = "trio-tray-section";
    tray.dataset.trayIndex = trayIndex;

    tray.innerHTML = `
      <h4>Tray ${trayIndex + 1}</h4>

      <div class="option">
        <label for="trio-flavour-${trayIndex}">
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

          ${product.flavourOptions
            .map((option) => {
              const flavourProduct =
                products[option.productId];

              return `
                <option
                  value="${option.productId}"
                  data-price="${flavourProduct.price}"
                >
                  ${flavourProduct.name}
                </option>
              `;
            })
            .join("")}
        </select>
      </div>

      <div
        class="trio-tray-options"
        id="trio-tray-options-${trayIndex}"
      ></div>
    `;

    flavourContainer.appendChild(tray);
  }

  document
    .querySelectorAll(".trio-flavour")
    .forEach((select) => {
      select.addEventListener(
        "change",
        function () {
          const trayIndex = Number(
            this.dataset.trayIndex
          );

          renderTrioTrayOptions(
            trayIndex,
            this.value
          );

          updateTrioFlavourLimits();
          validateTrioSelection();
          updateTrioSaving();
          updatePrice();
        }
      );
    });

  actionBtn.disabled = true;

  validateTrioSelection();
}


// ========================
// TRIO INDIVIDUAL TRAY OPTIONS
// ========================

function renderTrioTrayOptions(
  trayIndex,
  selectedProductId
) {
  const container = document.getElementById(
    `trio-tray-options-${trayIndex}`
  );

  container.innerHTML = "";

  if (!selectedProductId) {
    return;
  }

  const selectedProduct =
    products[selectedProductId];

  if (!selectedProduct) {
    return;
  }

  const removeOptionsHTML =
    selectedProduct.removable?.length
      ? selectedProduct.removable
          .map(
            (ingredient) => `
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
            `
          )
          .join("")
      : `
          <p class="empty-option-text">
            No removable ingredients
          </p>
        `;

  const baseOptionsHTML =
    selectedProduct.baseOptions
      .map(
        (option, index) => `
          <div class="option">
            <label>
              <input
                type="radio"
                name="trio-base-${trayIndex}"
                class="trio-base-option"
                value="${option.name}"
                data-price="${option.price}"
                ${index === 0 ? "checked" : ""}
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
                option.price > 0
                  ? `+$${option.price.toFixed(2)}`
                  : ""
              }
            </span>
          </div>
        `
      )
      .join("");

  const portionOptionsHTML =
    selectedProduct.portionOptions
      .map(
        (option, index) => `
          <div class="option">
            <label>
              <input
                type="radio"
                name="trio-portion-${trayIndex}"
                class="trio-portion-option"
                value="${option.name}"
                data-price="${option.price}"
                ${index === 0 ? "checked" : ""}
              >

              ${option.name}
            </label>

            <span>
              ${
                option.price > 0
                  ? `+$${option.price.toFixed(2)}`
                  : ""
              }
            </span>
          </div>
        `
      )
      .join("");

  container.innerHTML = `
    <div class="trio-subsection">
      <h5>Remove Ingredients</h5>

      ${removeOptionsHTML}
    </div>

    <div class="trio-subsection">
      <h5>Choose Your Base</h5>

      ${baseOptionsHTML}
    </div>

    <div class="trio-subsection">
      <h5>Portion Preference</h5>

      ${portionOptionsHTML}
    </div>
  `;

  container
    .querySelectorAll(
      ".trio-base-option, .trio-portion-option"
    )
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// PREVENT DUPLICATE TRIO FLAVOURS
// ========================

function updateTrioFlavourLimits() {
  const selects = [
    ...document.querySelectorAll(
      ".trio-flavour"
    )
  ];

  const selectedValues = selects
    .map((select) => select.value)
    .filter(Boolean);

  selects.forEach((select) => {
    const currentValue = select.value;

    [...select.options].forEach((option) => {
      if (!option.value) {
        return;
      }

      option.disabled =
        selectedValues.includes(option.value) &&
        option.value !== currentValue;
    });
  });
}


// ========================
// VALIDATE TRIO
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
    .map((select) => select.value)
    .filter(Boolean);

  const hasThreeFlavours =
    values.length === 3;

  const hasUniqueFlavours =
    new Set(values).size === values.length;

  const isValid =
    hasThreeFlavours &&
    hasUniqueFlavours;

  actionBtn.disabled = !isValid;

  if (!isValid) {
    actionBtn.textContent =
      "Choose 3 Different Flavours First";
  }

  return isValid;
}


// ========================
// TRIO ORIGINAL PRICE
// ========================

function updateTrioSaving() {
  if (product.id !== "trio") {
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
      select.options[select.selectedIndex];

    if (selectedOption?.dataset.price) {
      originalTotal += Number(
        selectedOption.dataset.price
      );

      selectedCount++;
    }
  });

  const originalPriceBox =
    document.getElementById(
      "original-price"
    );

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
// GET TRIO SELECTIONS
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
        `.trio-flavour[data-tray-index="${trayIndex}"]`
      );

    const selectedProductId =
      flavourSelect?.value;

    if (!selectedProductId) {
      return null;
    }

    const selectedProduct =
      products[selectedProductId];

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
        `.trio-remove-option[data-tray-index="${trayIndex}"]`
      )
      .forEach((checkbox) => {
        if (!checkbox.checked) {
          removed.push(checkbox.value);
        }
      });

    trays.push({
      trayNumber: trayIndex + 1,
      productId: selectedProductId,
      flavour: selectedProduct.name,
      base: selectedBase?.value || "",
      portion:
        selectedPortion?.value || "",
      removed
    });
  }

  return trays;
}


// ========================
// UPGRADE OPTIONS
// ========================

function renderUpgradeOptions() {
  upgradeContainer.innerHTML = "";

  if (!product.upgradeOptions?.length) {
    hideSection(upgradeSection);
    return;
  }

  showSection(upgradeSection);

  product.upgradeOptions.forEach(
    (option, index) => {
      upgradeContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="option">
            <label>
              <input
                type="radio"
                name="upgrade"
                value="${option.name}"
                data-price="${option.price}"
                ${index === 0 ? "checked" : ""}
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
                option.price > 0
                  ? `+$${option.price.toFixed(2)}`
                  : ""
              }
            </span>
          </div>
        `
      );
    }
  );

  document
    .querySelectorAll(
      'input[name="upgrade"]'
    )
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// STANDALONE UPGRADE PRODUCT
// ========================

function renderIncludedItems() {
  if (product.id !== "upgrade") {
    hideSection(includeSection);
    return;
  }

  showSection(includeSection);

  includeContainer.innerHTML = `
    <div class="option">
      <label>
        <input
          type="radio"
          checked
          disabled
        >

        100g Edamame
      </label>
    </div>

    <div class="option">
      <label>
        <input
          type="radio"
          checked
          disabled
        >

        350ml Yuzu Jasmine Tea
      </label>
    </div>
  `;
}


// ========================
// RESTORE NORMAL PRODUCT
// ========================

function restoreNormalProductSelections() {
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

  document
    .querySelectorAll(
      'input[name="base"]'
    )
    .forEach((radio) => {
      radio.checked =
        radio.value === editingItem.base;
    });

  document
    .querySelectorAll(
      'input[name="portion"]'
    )
    .forEach((radio) => {
      radio.checked =
        radio.value === editingItem.portion;
    });
}


// ========================
// RESTORE TRIO
// ========================

function restoreTrioSelections() {
  if (!editingItem.trays?.length) {
    return;
  }

  editingItem.trays.forEach(
    (tray, trayIndex) => {
      const flavourSelect =
        document.querySelector(
          `.trio-flavour[data-tray-index="${trayIndex}"]`
        );

      if (!flavourSelect) {
        return;
      }

      flavourSelect.value =
        tray.productId;

      renderTrioTrayOptions(
        trayIndex,
        tray.productId
      );

      document
        .querySelectorAll(
          `.trio-remove-option[data-tray-index="${trayIndex}"]`
        )
        .forEach((checkbox) => {
          checkbox.checked =
            !tray.removed?.includes(
              checkbox.value
            );
        });

      const baseRadio =
        document.querySelector(
          `input[name="trio-base-${trayIndex}"][value="${tray.base}"]`
        );

      if (baseRadio) {
        baseRadio.checked = true;
      }

      const portionRadio =
        document.querySelector(
          `input[name="trio-portion-${trayIndex}"][value="${tray.portion}"]`
        );

      if (portionRadio) {
        portionRadio.checked = true;
      }
    }
  );

  updateTrioFlavourLimits();
  validateTrioSelection();
  updateTrioSaving();
}


// ========================
// RESTORE UPGRADE
// ========================

function restoreUpgradeSelection() {
  if (!editingItem.upgrade) {
    return;
  }

  document
    .querySelectorAll(
      'input[name="upgrade"]'
    )
    .forEach((radio) => {
      radio.checked =
        radio.value === editingItem.upgrade;
    });
}


// ========================
// RESTORE EDIT SELECTIONS
// ========================

function restoreEditSelections() {
  if (!editingItem) {
    return;
  }

  instructionsInput.value =
    editingItem.instructions || "";

  if (product.id === "trio") {
    restoreTrioSelections();
  } else {
    restoreNormalProductSelections();
  }

  restoreUpgradeSelection();

  updatePrice();
}


// ========================
// QUANTITY
// ========================

function changeQty(delta) {
  quantity += delta;

  if (quantity < 1) {
    quantity = 1;
  }

  qtyElement.textContent = quantity;

  updatePrice();
}


// ========================
// PRICE CALCULATION
// ========================

function updatePrice() {
  let unitPrice = product.price;

  if (product.id === "trio") {
    for (
      let trayIndex = 0;
      trayIndex < 3;
      trayIndex++
    ) {
      unitPrice += getSelectedRadioPrice(
        `trio-base-${trayIndex}`
      );

      unitPrice += getSelectedRadioPrice(
        `trio-portion-${trayIndex}`
      );
    }
  } else {
    unitPrice +=
      getSelectedRadioPrice("base");

    unitPrice +=
      getSelectedRadioPrice("portion");
  }

  unitPrice +=
    getSelectedRadioPrice("upgrade");

  const total =
    unitPrice * quantity;

  const actionText =
    editIndex !== null
      ? "Update Cart"
      : "Add To Cart";

  if (
    product.id === "trio" &&
    !validateTrioSelection()
  ) {
    return;
  }

  actionBtn.innerHTML =
    `${actionText} — ` +
    `<span id="final-price">` +
    `$${total.toFixed(2)}` +
    `</span>`;
}


// ========================
// ADD TO CART
// ========================

function addToCart() {
  let cart = JSON.parse(
    localStorage.getItem(
      "sushibakeCart"
    )
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }

  if (
    product.id === "trio" &&
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
      selectedUpgrade?.dataset.price || 0
    );

  const finalPrice =
    Number(
      document
        .getElementById("final-price")
        .textContent
        .replace("$", "")
    );

  const cartItem = {
    id: product.id,
    name: product.name,
    image: product.image,

    qty: quantity,

    basePrice: product.price,

    unitPrice:
      finalPrice / quantity,

    finalPrice,

    instructions:
      instructionsInput.value.trim(),

    upgrade,
    upgradePrice
  };

  if (product.id === "trio") {
    cartItem.trays =
      getTrioSelections();
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

    cartItem.removed = removed;

    cartItem.base =
      getSelectedRadioValue("base");

    cartItem.portion =
      getSelectedRadioValue("portion");
  }

  if (editIndex !== null) {
    cart[Number(editIndex)] =
      cartItem;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem(
    "sushibakeCart",
    JSON.stringify(cart)
  );

  window.location.href =
    "./cart.html";
}


// ========================
// CLOSE PRODUCT PAGE
// ========================

function closeProductPage() {
  history.back();
}


// ========================
// INITIALISE PAGE
// ========================

function initialiseProductPage() {
  hideSection(flavourSection);
  hideSection(removeSection);
  hideSection(baseSection);
  hideSection(portionSection);
  hideSection(includeSection);
  hideSection(upgradeSection);

  if (product.id === "trio") {
    renderTrioSections();
    renderUpgradeOptions();
  } else if (product.id === "upgrade") {
    renderIncludedItems();
  } else {
    renderRemoveOptions();
    renderBaseOptions();
    renderPortionOptions();
    renderUpgradeOptions();
  }

  restoreEditSelections();

  updatePrice();
}

initialiseProductPage();