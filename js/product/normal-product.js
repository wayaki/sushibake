// ================================================
// Individual product option rendering
// ================================================


// ========================
// REMOVE OPTIONS
// Render removable ingredient options
// ========================

function renderRemoveOptions() {
  removeContainer.innerHTML = "";

  if (!product.removable?.length) {
    hideSection(removeSection);
    return;
  }

  showSection(removeSection);

  product.removable.forEach(
    (ingredient) => {
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
    }
  );
}


// ========================
// BASE OPTIONS
// Render available base options
// ========================

function renderBaseOptions() {
  baseContainer.innerHTML = "";

  if (!product.baseOptions?.length) {
    hideSection(baseSection);
    return;
  }

  showSection(baseSection);

  product.baseOptions.forEach(
    (option, index) => {
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
                ${index === 0
                  ? "checked"
                  : ""}
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
      'input[name="base"]'
    )
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// PORTION OPTIONS
// Render available portion options
// ========================

function renderPortionOptions() {
  portionContainer.innerHTML = "";

  if (
    !product.portionOptions?.length
  ) {
    hideSection(portionSection);
    return;
  }

  showSection(portionSection);

  product.portionOptions.forEach(
    (option, index) => {
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
                ${index === 0
                  ? "checked"
                  : ""}
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
    }
  );

  document
    .querySelectorAll(
      'input[name="portion"]'
    )
    .forEach((input) => {
      input.addEventListener(
        "change",
        updatePrice
      );
    });
}


// ========================
// UPGRADE OPTIONS
// Render available upgrade options
// ========================

function renderUpgradeOptions() {
  upgradeContainer.innerHTML = "";

  if (
    !product.upgradeOptions?.length
  ) {
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
                ${index === 0
                  ? "checked"
                  : ""}
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
// INCLUDED ITEMS
// Render the fixed items included with the product
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