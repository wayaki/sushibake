// ================================================
// DOUBLE-UP flavour selection and pricing
// ================================================


// ========================
// FLAVOUR EXTRA PRICE
// Get the additional price for a selected flavour
// ========================

function getDoubleUpFlavourExtra(
  flavourId
) {
  const option =
    product.flavourOptions.find(
      (flavour) =>
        flavour.productId ===
        flavourId
    );

  return Number(
    option?.extra || 0
  );
}


// ========================
// DOUBLE-UP PRICE
// Calculate the price for both selected flavours
// ========================

function getDoubleUpPrice(
  firstFlavour,
  secondFlavour
) {
  return (
    product.price +
    getDoubleUpFlavourExtra(
      firstFlavour
    ) +
    getDoubleUpFlavourExtra(
      secondFlavour
    )
  );
}


// ========================
// FLAVOUR OPTIONS
// Render the two Double-Up flavour selections
// ========================

function renderDoubleUpFlavours() {
  showSection(flavourSection);

  const title =
    document.getElementById(
      "flavour-section-title"
    );

  const description =
    document.getElementById(
      "flavour-section-desc"
    );

  title.textContent =
    "Build Your Double-Up";

  description.textContent =
    "Choose a flavour for each half and customise them.";

  const flavourChoices =
    product.flavourOptions
      .map((option) => {
        const flavourProduct =
          PRODUCTS[
            option.productId
          ];

        const extraText =
          option.extra > 0
            ? ` (+$${option.extra})`
            : "";

        return `
          <option
            value="${option.productId}"
          >
            ${flavourProduct.name}${extraText}
          </option>
        `;
      })
      .join("");

  flavourContainer.innerHTML = `
    
    <div class="doubleup-flavour-group">
      <h4>
          First Half
      </h4>
      <div class="option">
        <label for="doubleup-flavour-1">
          Flavour
        </label>
      
        <select
          id="doubleup-flavour-1"
          class="flavour-select"
          data-half="1"
        >
          <option value="">
            Choose flavour
          </option>

          ${flavourChoices}
        </select>
      </div>
      <div
        id="doubleup-options-1"
        class="doubleup-half-options"
      ></div>
    </div>


    <div class="doubleup-flavour-group">
      <h4>
        Second Half
      </h4>
      <label for="doubleup-flavour-2">
        Flavour
      </label>

      <select
        id="doubleup-flavour-2"
        class="flavour-select"
        data-half="2"
      >
        <option value="">
          Choose flavour
        </option>

        ${flavourChoices}
      </select>

      <div
        id="doubleup-options-2"
        class="doubleup-half-options"
      ></div>
    </div>
  `;

  const firstSelect =
    document.getElementById(
      "doubleup-flavour-1"
    );

  const secondSelect =
    document.getElementById(
      "doubleup-flavour-2"
    );

  firstSelect.addEventListener(
    "change",
    handleDoubleUpFlavourChange
  );

  secondSelect.addEventListener(
    "change",
    handleDoubleUpFlavourChange
  );
}


// ========================
// VALIDATE FLAVOURS
// Check that both Double-Up flavours are selected
// ========================

function validateDoubleUpSelection() {
  const firstFlavour =
    document.getElementById(
      "doubleup-flavour-1"
    )?.value;

  const secondFlavour =
    document.getElementById(
      "doubleup-flavour-2"
    )?.value;

  return Boolean(
    firstFlavour &&
    secondFlavour
  );
}


// ========================
// SELECTED FLAVOURS
// Get the selected Double-Up flavour details
// ========================

function getDoubleUpSelections() {
  const firstFlavour =
    document.getElementById(
      "doubleup-flavour-1"
    ).value;

  const secondFlavour =
    document.getElementById(
      "doubleup-flavour-2"
    ).value;

  function getRemovedForHalf(
    half
  ) {
    const removed = [];

    document
      .querySelectorAll(
        `.doubleup-remove-option` +
        `[data-half="${half}"]`
      )
      .forEach((checkbox) => {
        if (!checkbox.checked) {
          removed.push(
            checkbox.value
          );
        }
      });

    return removed;
  }

  return [
    {
      id: firstFlavour,
      name:
        PRODUCTS[firstFlavour].name,

      removed:
        getRemovedForHalf(1)
    },

    {
      id: secondFlavour,
      name:
        PRODUCTS[secondFlavour].name,

      removed:
        getRemovedForHalf(2)
    }
  ];
}

// ========================
// HANDLE FLAVOUR CHANGE
// Update after changing its flavour
// ========================
function handleDoubleUpFlavourChange(
  event
) {
  const select =
    event.currentTarget;

  const half =
    Number(select.dataset.half);

  renderDoubleUpHalfOptions(
    half,
    select.value
  );

  validateDoubleUpSelection();
  updatePrice();
}

function renderDoubleUpHalfOptions(
  half,
  flavourId
) {
  const container =
    document.getElementById(
      `doubleup-options-${half}`
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!flavourId) {
    return;
  }

  const selectedProduct =
    PRODUCTS[flavourId];

  if (!selectedProduct) {
    return;
  }

  const removable =
    selectedProduct.removable || [];

  if (removable.length === 0) {
    container.innerHTML = `
      <p class="empty-option-text">
        No removable ingredients
      </p>
    `;

    return;
  }

  container.innerHTML = `
    <div class="doubleup-subsection">
      <h5>
        Remove Ingredients
      </h5>

      ${removable
        .map((ingredient) => `
          <div class="option">
            <label>
              <input
                type="checkbox"
                class="doubleup-remove-option"
                data-half="${half}"
                value="${ingredient}"
                checked
              >

              ${ingredient}
            </label>
          </div>
        `)
        .join("")}
    </div>
  `;
}