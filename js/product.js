// get product id and edit index from URL
const params = new URLSearchParams(window.location.search);

const itemId = params.get("item");
const editIndex = params.get("edit");

// change button text when editing cart item
if (editIndex !== null) {
  document.querySelector(".add-cart-btn").innerHTML =
    `Update Cart — <span id="final-price">$0.00</span>`;
}

// cart action button
const actionBtn = document.getElementById("cart-action-btn");

if (editIndex !== null) {
  actionBtn.innerHTML = `Update Cart — <span id="final-price">$0.00</span>`;
}

// get selected product from products.js
const product = products[itemId];

// hide irrelevant sections based on product type
if (product.id === "upgrade") {
  document.getElementById("remove-options").parentElement.style.display = "none";
  document.getElementById("rice-options").parentElement.style.display = "none";
  document.getElementById("upgrade-options").parentElement.style.display = "none";
} else {
  document.getElementById("include-options").parentElement.style.display = "none";
}

// get saved cart from localStorage
let savedCart = JSON.parse(localStorage.getItem("sushibakeCart"));

// fallback if cart is invalid
if (!Array.isArray(savedCart)) {
  savedCart = [];
}
// get item being edited
const editingItem = 
  editIndex !== null 
    ? savedCart[Number(editIndex)] 
    : null;

// default quantity
let quantity = 1;

// ========================
// PRODUCT INFORMATION
// ========================

// display product image, name and description
document.getElementById("product-image").src = product.image;

document.getElementById("product-name").textContent = product.name;

document.getElementById("product-desc").textContent = product.description;


// ========================
// WAYAKI TRIO FLAVOURS
// ========================
const flavourSection = document.getElementById("flavour-section");
const flavourContainer = document.getElementById("flavour-options");

// generate flavour selectors for Wayaki Trio
if (product.id === "trio") {
  flavourSection.style.display = "block";

  flavourContainer.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    flavourContainer.innerHTML += `
          <div class="option">

            <label>Flavour ${i}</label>

            <select class="trio-flavour" onchange="updateTrioOptions(); validateTrioSelection();">

              <option value="">Choose flavour</option>

              ${product.flavourOptions
                .map(
                  (flavour) => `
                <option value="${flavour.name}" data-price="${flavour.price}">
                  ${flavour.name}
                </option>
              `,
                )
                .join("")}

            </select>

          </div>
        `;
  }
  // disable add to cart until all flavours selected
  document.getElementById("cart-action-btn").disabled = true;

  validateTrioSelection();
}

// ========================
// REMOVABLE INGREDIENTS
// ========================

const removeContainer = document.getElementById("remove-options");

// generate removable ingredient checkboxes
if (product.removable && product.removable.length > 0) {
  product.removable.forEach((item) => {
    removeContainer.innerHTML += `
          <div class="option">
            <label>
              <input type="checkbox" value="${item}" checked>
              ${item}
            </label>
          </div>
        `;
  });
} else {
  // hide section if no removable ingredients
  removeContainer.parentElement.style.display = "none";
}

// ========================
// RICE OPTIONS
// ========================

const riceContainer = document.getElementById("rice-options");

// generate rice preference options
if (product.riceOptions && product.riceOptions.length > 0) {
  product.riceOptions.forEach((option, index) => {
    riceContainer.innerHTML += `
          <div class="option">
            <label>
              <input
                type="radio"
                name="rice"
                value="${option.price}"
                ${index === 0 ? "checked" : ""}
                onchange="updatePrice()"
              >

              ${option.name}
              ${
                option.subtitle
                  ? `<small class="option-subtitle">${option.subtitle}</small>`
                  : ""
              }
            </label>
            <span>${option.price > 0 ? `+$${option.price}` : ""}</span>
          </div>
        `;
  });
} else {
  // hide section if product has no rice options
  riceContainer.parentElement.style.display = "none";
}


// ========================
// UPGRADE SET INCLUDES
// ========================
const includeContainer = document.getElementById("include-options");

// show included items for standalone Upgrade to Set
if (product.id === "upgrade") {
  includeContainer.innerHTML = `
        <div class="option">
          <label>
            <input type="radio" checked disabled>
            100g Edamame
          </label>
        </div>

        <div class="option">
          <label>
            <input type="radio" checked disabled>
            350ml Yuzu Jasmine Tea
          </label>
        </div>
      `;

  includeContainer.parentElement.style.display = "block";
}

// display product base price
document.getElementById("product-price").textContent =
  `$${product.price.toFixed(2)}`;

// ========================
// UPGRADE OPTIONS
// ========================

// get upgrade options container
const upgradeContainer =
  document.getElementById("upgrade-options");

  // show upgrade options if this product has upgrade options
if (
  upgradeContainer &&
  product.upgradeOptions &&
  product.upgradeOptions.length > 0
) {
  // generate each upgrade option
  product.upgradeOptions.forEach((option, index) => {
    upgradeContainer.innerHTML += `
      <div class="option">
        <label>
          <input
            type="radio"
            name="upgrade"
            value="${option.price}"
            ${index === 0 ? "checked" : ""}
            onchange="updatePrice()"
          >

          ${option.name}

          ${
            option.subtitle
              ? `<small class="option-subtitle">${option.subtitle}</small>`
              : ""
          }
        </label>

        <span>
          ${
            option.name === "Upgrade to Set"
              ? `
                <span class="old-price">$3.90</span>
                <span class="promo-price">$2.90</span>
              `
              : option.price > 0
                ? `+$${option.price.toFixed(2)}`
                : ""
          }
        </span>
      </div>
    `;
  });

} else if (upgradeContainer) {
  // hide upgrade section if product has no upgrade options
  upgradeContainer.parentElement.style.display = "none";
}

// ========================
// RESTORE EDIT SELECTIONS
// ========================

// restore previous selections when editing cart item
function restoreEditSelections() {
  if (!editingItem) return;

  // restore quantity
  quantity = editingItem.qty || 1;
  document.getElementById("qty").textContent = quantity;

  // restore removed ingredients
  const removeBoxes = document.querySelectorAll("#remove-options input");

  removeBoxes.forEach((box) => {
    if (editingItem.removed?.includes(box.value)) {
      box.checked = false;
    } else {
      box.checked = true;
    }
  });

  // restore rice option
  const riceRadios = document.querySelectorAll('input[name="rice"]');

  riceRadios.forEach((radio) => {
    const labelText = radio.parentElement.innerText.trim();

    if (editingItem.rice?.includes(labelText)) {
      radio.checked = true;
    }
  });

  // restore special instructions
  document.getElementById("instructions").value =
    editingItem.instructions || "";

  // update price after restoring selections
  updatePrice();
}

// initialize edit mode selections
restoreEditSelections();

// ========================
// TRIO VALIDATION
// ========================

// make sure all 3 trio flavours are selected before allowing add to cart
function validateTrioSelection() {
  if (product.id !== "trio") return;

  const selects = document.querySelectorAll(".trio-flavour");

  const allSelected = [...selects].every((select) => select.value !== "");

  const button = document.getElementById("cart-action-btn");

  button.disabled = !allSelected;

  if (!allSelected) {
    button.innerHTML = `Choose 3 Flavours First`;
  } else {
    updatePrice();
  }
}

// ========================
// CLOSE PRODUCT PAGE
// ========================

// go back to previous page
function closeProductPage() {
  history.back();
}

// ========================
// QUANTITY
// ========================

// increase or decrease product quantity
function changeQty(delta) {
  quantity += delta;

  // prevent quantity from going below 1
  if (quantity < 1) {
    quantity = 1;
  }

  document.getElementById("qty").textContent = quantity;

  updatePrice();
}

// ========================
// PRICE CALCULATION
// ========================

// update final price based on rice, upgrade option and quantity
function updatePrice() {
  let total = product.price;

  // add rice option price
  const riceOption = document.querySelector('input[name="rice"]:checked');

  if (riceOption) {
    total += parseFloat(riceOption.value);
  }

  // add upgrade option price
  const upgradeOption =
    document.querySelector('input[name="upgrade"]:checked');

  if (upgradeOption) {
    total += parseFloat(upgradeOption.value);
  }

  // multiply by quantity
  total *= quantity;

  const actionText = editIndex !== null ? "Update Cart" : "Add To Cart";

  document.getElementById("cart-action-btn").innerHTML =
    `${actionText} — <span id="final-price">$${total.toFixed(2)}</span>`;
}

// initialize price when page loads
updatePrice();

// ========================
// TRIO OPTION LIMITS
// ========================

// prevent customers from choosing the same trio flavour more than once
function updateTrioOptions() {
  const selects = document.querySelectorAll(".trio-flavour");

  const selectedValues = [...selects]
    .map((select) => select.value)
    .filter((value) => value !== "");

  selects.forEach((select) => {
    const currentValue = select.value;

    [...select.options].forEach((option) => {
      if (option.value === "") return;

      option.disabled =
        selectedValues.includes(option.value) && option.value !== currentValue;
    });
  });

  updateTrioSaving();
}

// ========================
// TRIO ORIGINAL PRICE
// ========================

// calculate and show original total price of selected trio flavours
function updateTrioSaving() {
  const selects = document.querySelectorAll(".trio-flavour");

  let originalTotal = 0;
  let selectedCount = 0;

  selects.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption && selectedOption.dataset.price) {
      originalTotal += parseFloat(selectedOption.dataset.price);
      selectedCount++;
    }
  });

  const originalPriceBox = document.getElementById("original-price");

  if (selectedCount === 3) {
    originalPriceBox.textContent = `$${originalTotal.toFixed(2)}`;
    originalPriceBox.style.display = "inline";
  } else {
    originalPriceBox.textContent = "";
    originalPriceBox.style.display = "none";
  }
}

// ========================
// ADD TO CART
// ========================

// add selected product and options into cart
function addToCart() {
  // get existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("sushibakeCart"));

  // fallback if cart is invalid
  if (!Array.isArray(cart)) {
    cart = [];
  }

  // get selected trio flavours
  const selectedFlavours = [...document.querySelectorAll(".trio-flavour")]
    .map((select) => select.value)
    .filter((value) => value);

  // get removed ingredients
  const removed = [];

  const ingredientCheckboxes = document.querySelectorAll(
    "#remove-options input",
  );

  ingredientCheckboxes.forEach((box) => {
    if (!box.checked) {
      removed.push(box.value);
    }
  });

  // get selected rice option
  const selectedRice = document.querySelector('input[name="rice"]:checked');

  const rice = selectedRice
    ? selectedRice.parentElement.innerText.split("\n")[0].trim()
    : "";

  // get selected upgrade option
  const selectedUpgrade =
    document.querySelector('input[name="upgrade"]:checked');

  const upgrades = [];

  if (selectedUpgrade && parseFloat(selectedUpgrade.value) > 0) {
    upgrades.push(
      selectedUpgrade.parentElement.innerText.split("\n")[0].trim()
    );
  }

  // get special instructions
  const instructions = document.getElementById("instructions").value;

  // get final price from button
  const finalPrice = parseFloat(
    document.getElementById("final-price").textContent.replace("$", ""),
  );

  // create cart item object
  const cartItem = {
    id: product.id,
    name: product.name,
    image: product.image,
    qty: quantity,
    basePrice: product.price,
    finalPrice,

    selectedFlavours,

    removed,
    rice,
    instructions,
    upgrades,
  };

  // update existing cart item if editing, otherwise add new item
  if (editIndex !== null) {
    cart[Number(editIndex)] = cartItem;
  } else {
    cart.push(cartItem);
  }

  // save cart to localStorage
  localStorage.setItem("sushibakeCart", JSON.stringify(cart));

  // go to cart page
  window.location.href = "./cart.html";
}
