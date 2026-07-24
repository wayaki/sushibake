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
    "Choose a flavour for each half. You may select the same flavour twice.";

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
      <label for="doubleup-flavour-1">
        First Flavour
      </label>

      <select
        id="doubleup-flavour-1"
        class="flavour-select"
      >
        ${flavourChoices}
      </select>
    </div>

    <div class="doubleup-flavour-group">
      <label for="doubleup-flavour-2">
        Second Flavour
      </label>

      <select
        id="doubleup-flavour-2"
        class="flavour-select"
      >
        ${flavourChoices}
      </select>
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

  firstSelect.value = "tuna";
  secondSelect.value = "tuna";

  firstSelect.addEventListener(
    "change",
    updatePrice
  );

  secondSelect.addEventListener(
    "change",
    updatePrice
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

  return [
    {
      id: firstFlavour,
      name:
        PRODUCTS[firstFlavour].name
    },
    {
      id: secondFlavour,
      name:
        PRODUCTS[secondFlavour].name
    }
  ];
}