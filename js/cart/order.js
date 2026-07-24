// ================================================
// WhatsApp order message and checkout
// ================================================


// ========================
// BUILD ORDER MESSAGE
// Create the complete WhatsApp order message
// ========================

function buildOrderMessage(data) {
  let message =
    `Hello! My name is ${data.name}.\n`;

  message +=
    `I'd like to order from WAYAKI Sushibake 🍣\n\n`;

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
      const firstFlavour =
        item.flavours?.[0]?.name || "";

      const secondFlavour =
        item.flavours?.[1]?.name || "";

      message +=
        `  Flavours: ` +
        `${firstFlavour} + ` +
        `${secondFlavour}\n`;

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

function orderWhatsApp() {
  const data = getFormData();
  const error = validateForm(data);

  if (error) {
    alert(error);
    return;
  }

  const message =
    buildOrderMessage(data);

  const phone = "6584840768";

  const url =
    `https://api.whatsapp.com/send` +
    `?phone=${phone}` +
    `&text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  setTimeout(() => {
    cart = [];
    saveCart();

    renderCart();
    toggleDelivery();
  }, 1500);
}