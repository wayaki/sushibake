// ================================================
// WhatsApp order message and checkout
// ================================================

import {
  buildOrderPayload,
  createOrder
} from "../api/cart-api.js";

// ========================
// BUILD ORDER MESSAGE
// Create the complete WhatsApp order message
// ========================

function buildOrderMessage(
  data,
  orderNumber
) {
  let message =
    `Hello! My name is ${data.name}.\n`;

  message +=
    `I'd like to order from WAYAKI Sushibake 🍣\n\n`;

  message +=
    `Order No: ${orderNumber}\n\n`;

  message +=
    `Order Date: ${data.orderDate}\n`;

  message +=
    `Preferred Time: ${data.pickupTime}\n\n`;

  message += "Order:\n";

  cart.forEach((item) => {
    message +=
      `* ${item.name} x ${item.qty}` +
      ` — $${Number(
        item.finalPrice
      ).toFixed(2)}\n`;

    if (
      item.id === "trio" &&
      Array.isArray(item.trays)
    ) {
      item.trays.forEach((tray) => {
        message +=
          `  Tray ${tray.trayNumber}: ` +
          `${tray.flavour}\n`;

        message +=
          `    Base: ${tray.base}\n`;

        message +=
          `    Portion: ${tray.portion}\n`;

        if (tray.removed?.length) {
          message +=
            `    No: ` +
            `${tray.removed.join(", ")}\n`;
        }
      });
    } else if (
      item.id === "doubleup"
    ) {
      const firstHalf =
        item.flavours?.[0];

      const secondHalf =
        item.flavours?.[1];

      message +=
        `  First Half: ` +
        `${firstHalf?.name || ""}\n`;

      if (
        firstHalf?.removed?.length
      ) {
        message +=
          `    No: ` +
          `${firstHalf.removed.join(", ")}\n`;
      }

      message +=
        `  Second Half: ` +
        `${secondHalf?.name || ""}\n`;

      if (
        secondHalf?.removed?.length
      ) {
        message +=
          `    No: ` +
          `${secondHalf.removed.join(", ")}\n`;
      }

      message +=
        `  Base: ${item.base}\n`;
    } else {
      if (item.base) {
        message +=
          `  Base: ${item.base}\n`;
      }

      if (item.portion) {
        message +=
          `  Portion: ${item.portion}\n`;
      }

      if (item.removed?.length) {
        message +=
          `  No: ` +
          `${item.removed.join(", ")}\n`;
      }
    }

    if (
      item.upgrade &&
      item.upgrade !== "No Upgrade"
    ) {
      message +=
        `  Upgrade: ${item.upgrade}\n`;
    }

    if (item.instructions) {
      message +=
        `  Note: ${item.instructions}\n`;
    }

    message += "\n";
  });

  const methodLabel =
    data.method === "self"
      ? "Self-Collect"
      : "Delivery";

  message +=
    `\nCollection Method: ${methodLabel}`;

  if (data.method === "self") {
    message +=
      `\nPick-up Location:\n` +
      `${data.pickupLocation}`;
  } else {
    const originalFee =
      deliveryFees[data.area] || 0;

    const finalFee =
      getDeliveryFee();

    const subtotal =
      calculateSubtotal();

    const areaLabel =
      data.area.charAt(0).toUpperCase() +
      data.area.slice(1);

    message +=
      `\nDelivery Area: ${areaLabel}`;

    if (
      finalFee === 0 &&
      subtotal >= 50
    ) {
      message +=
        "\nDelivery Fee: FREE";
    } else if (
      finalFee < originalFee
    ) {
      message +=
        `\nDelivery Fee: ` +
        `$${finalFee.toFixed(2)}` +
        ` (Promo applied)`;
    } else {
      message +=
        `\nDelivery Fee: ` +
        `$${finalFee.toFixed(2)}`;
    }

    message +=
      `\nAddress: ${data.address}`;

    message +=
      `\nPostal Code: ${data.postal}`;

    message +=
      `\nUnit No: ${data.unit}`;
  }

  message +=
    `\n\nContact Number: ${data.phone}`;

  message +=
    `\nTotal: $${calculateTotal()}`;

  return message;
}


// ========================
// WHATSAPP CHECKOUT
// Validate the order and open WhatsApp checkout
// ========================

async function orderWhatsApp() {
  const data = getFormData();
  const error = validateForm(data);

  if (error) {
    alert(error);
    return;
  }

  const deliveryFee =
    data.method === "delivery"
      ? getDeliveryFee()
      : 0;

  const payload =
    buildOrderPayload(
      data,
      cart,
      deliveryFee
    );

  console.log(
    "Order payload:",
    payload
  );

  let createdOrder;

  try {
    createdOrder =
      await createOrder(payload);

    console.log(
      "Created order:",
      createdOrder
    );

  } catch (error) {
    console.error(
      "Order creation failed:",
      error
    );

    alert(
      "Unable to create your order. Please try again."
    );

    return;
  }

  const message =
    buildOrderMessage(
      data,
      createdOrder.created_order_number
    );
  const phone = "6584840768";

  const url =
    `https://api.whatsapp.com/send` +
    `?phone=${phone}` +
    `&text=${encodeURIComponent(message)}`;

  const whatsappWindow =
    window.open(url, "_blank");

  if (!whatsappWindow) {
    alert(
      "Please allow pop-ups to open WhatsApp."
    );
    return;
  }

  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
    toggleDelivery();
  }, 1500);
}

const orderButton =
  document.getElementById("order-btn");

if (orderButton) {
  orderButton.addEventListener(
    "click",
    orderWhatsApp
  );
}

