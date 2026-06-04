    const params = new URLSearchParams(window.location.search);

    const itemId = params.get("item");
    const editIndex = params.get("edit");

    if (editIndex !== null) {
      document.querySelector(".add-cart-btn").innerHTML =
        `Update Cart — <span id="final-price">$0.00</span>`;
    }

    const actionBtn =
      document.getElementById("cart-action-btn");

    if (editIndex !== null) {
      actionBtn.innerHTML =
        `Update Cart — <span id="final-price">$0.00</span>`;
    }

    const product = products[itemId];

    const cart = JSON.parse(localStorage.getItem("sushibakeCart")) || [];
    const editingItem = editIndex !== null ? cart[Number(editIndex)] : null;

    let quantity = 1;

    let selectedRicePrice = 0;

    // set product info
    document.getElementById("product-image").src = product.image;

    document.getElementById("product-name").textContent = product.name;

    document.getElementById("product-desc").textContent = product.description;

    document.getElementById("product-price").textContent =
      `$${product.price.toFixed(2)}`;

    // trio flavour options
    const flavourSection = document.getElementById("flavour-section");
    const flavourContainer = document.getElementById("flavour-options");

    if (product.id === "trio") {
      flavourSection.style.display = "block";

      flavourContainer.innerHTML = "";

      for (let i = 1; i <= 3; i++) {

        flavourContainer.innerHTML += `
          <div class="option">

            <label>Flavour ${i}</label>

            <select class="trio-flavour" onchange="updateTrioOptions(); validateTrioSelection();">

              <option value="">Choose flavour</option>

              ${product.flavourOptions.map(flavour => `
                <option value="${flavour.name}" data-price="${flavour.price}">
                  ${flavour.name}
                </option>
              `).join("")}

            </select>

          </div>
        `;
      }
    document.getElementById("cart-action-btn").disabled = true;
    
    validateTrioSelection();
    }

    // removable ingredients
    const removeContainer = document.getElementById("remove-options");

    if (product.removable && product.removable.length > 0) {
      product.removable.forEach(item => {
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
      removeContainer.parentElement.style.display = "none";
    }

    // rice options
    const riceContainer = document.getElementById("rice-options");

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
            </label>

            <span>${option.price > 0 ? `+$${option.price}` : ""}</span>
          </div>
        `;
      });
    } else {
      riceContainer.parentElement.style.display = "none";
    }

    function restoreEditSelections() {
      if (!editingItem) return;

      // quantity
      quantity = editingItem.qty || 1;
      document.getElementById("qty").textContent = quantity;

      // removed ingredients
      const removeBoxes = document.querySelectorAll("#remove-options input");

      removeBoxes.forEach(box => {
        if (editingItem.removed?.includes(box.value)) {
          box.checked = false;
        } else {
          box.checked = true;
        }
      });

      // rice option
      const riceRadios = document.querySelectorAll('input[name="rice"]');

      riceRadios.forEach(radio => {
        const labelText = radio.parentElement.innerText.trim();

        if (editingItem.rice?.includes(labelText)) {
          radio.checked = true;
        }
      });

      // instructions
      document.getElementById("instructions").value =
        editingItem.instructions || "";

      updatePrice();
    }

    restoreEditSelections();

    function validateTrioSelection() {
        if (product.id !== "trio") return;

        const selects =
          document.querySelectorAll(".trio-flavour");

        const allSelected =
          [...selects].every(select => select.value !== "");

        const button =
          document.getElementById("cart-action-btn");

        button.disabled = !allSelected;

        if (!allSelected) {
          button.innerHTML =
            `Choose 3 Flavours First`;
        } else {
          updatePrice();
        }
      }

    function closeProductPage() {
      history.back();
    }

    // quantity
    function changeQty(delta) {

      quantity += delta;

      if (quantity < 1) {
        quantity = 1;
      }

      document.getElementById("qty").textContent = quantity;

      updatePrice();
    }

    // update price
    function updatePrice() {

      let total = product.price;

      // rice
      const riceOption =
        document.querySelector('input[name="rice"]:checked');

      if (riceOption) {
        total += parseFloat(riceOption.value);
      }

      total *= quantity;

      const actionText =
        editIndex !== null ? "Update Cart" : "Add To Cart";

      document.getElementById("cart-action-btn").innerHTML =
        `${actionText} — <span id="final-price">$${total.toFixed(2)}</span>`;
    }

    updatePrice();

    function updateTrioOptions() {
      const selects = document.querySelectorAll(".trio-flavour");

      const selectedValues = [...selects]
        .map(select => select.value)
        .filter(value => value !== "");

      selects.forEach(select => {
        const currentValue = select.value;

        [...select.options].forEach(option => {
          if (option.value === "") return;

          option.disabled =
            selectedValues.includes(option.value) &&
            option.value !== currentValue;
        });
      });

      updateTrioSaving();
    }

    function updateTrioSaving() {
      const selects = document.querySelectorAll(".trio-flavour");

      let originalTotal = 0;
      let selectedCount = 0;

      selects.forEach(select => {
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

    // add to cart
    function addToCart() {

      const cart =
        JSON.parse(localStorage.getItem("sushibakeCart")) || [];

      const selectedFlavours =
        [...document.querySelectorAll(".trio-flavour")]
        .map(select => select.value)
        .filter(value => value);

      // removed ingredients
      const removed = [];

      const ingredientCheckboxes =
        document.querySelectorAll("#remove-options input");

      ingredientCheckboxes.forEach(box => {

        if (!box.checked) {
          removed.push(box.value);
        }
      });

      // selected rice
      const selectedRice = document.querySelector('input[name="rice"]:checked');

      const rice = selectedRice
        ? selectedRice.parentElement.innerText.trim()
        : "";

      // instructions
      const instructions =
        document.getElementById("instructions").value;

      // final price
      const finalPrice =
        parseFloat(
          document.getElementById("final-price")
          .textContent.replace("$", "")
        );

      // add item
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
        instructions
      };

      if (editIndex !== null) {
        cart[Number(editIndex)] = cartItem;
      } else {
        cart.push(cartItem);
      }

      // save cart
      localStorage.setItem(
        "sushibakeCart",
        JSON.stringify(cart)
      );

      // redirect
      window.location.href = "cart.html";
    }