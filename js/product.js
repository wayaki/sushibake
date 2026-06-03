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

    // removable ingredients
    const removeContainer = document.getElementById("remove-options");

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

    // rice options
    const riceContainer = document.getElementById("rice-options");

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

          <span>
            ${option.price > 0 ? `+$${option.price}` : ""}
          </span>

        </div>
      `;
    });

    // addons
    const addonContainer = document.getElementById("addon-options");

    product.addons.forEach(addon => {

      addonContainer.innerHTML += `
        <div class="option">

          <label>

            <input 
              type="checkbox"
              value="${addon.price}"
              onchange="updatePrice()"
              class="addon-checkbox"
            >

            ${addon.name}

          </label>

          <span>+$${addon.price.toFixed(2)}</span>

        </div>
      `;
    });

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

      // add-ons
      const addonBoxes = document.querySelectorAll(".addon-checkbox");

      addonBoxes.forEach(box => {
        const labelText = box.parentElement.innerText.trim();

        if (editingItem.addons?.some(addon => addon.includes(labelText))) {
          box.checked = true;
        }
      });

      // instructions
      document.getElementById("instructions").value =
        editingItem.instructions || "";

      updatePrice();
    }

    restoreEditSelections();

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

      // addons
      const addons =
        document.querySelectorAll(".addon-checkbox:checked");

      addons.forEach(addon => {
        total += parseFloat(addon.value);
      });

      total *= quantity;

      const actionText =
        editIndex !== null ? "Update Cart" : "Add To Cart";

      document.getElementById("cart-action-btn").innerHTML =
        `${actionText} — <span id="final-price">$${total.toFixed(2)}</span>`;
    }

    updatePrice();

    // add to cart
    function addToCart() {

      const cart =
        JSON.parse(localStorage.getItem("sushibakeCart")) || [];

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
      const rice =
        document.querySelector('input[name="rice"]:checked')
        .parentElement.innerText.trim();

      // addons
      const addons = [];

      const addonCheckboxes =
        document.querySelectorAll(".addon-checkbox:checked");

      addonCheckboxes.forEach(box => {

        addons.push(
          box.parentElement.innerText.trim()
        );
      });

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

        removed,
        rice,
        addons,
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
      window.location.href = "cart-backup.html";
    }