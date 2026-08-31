// ================================================
// WhatsApp Order Helpers
// ================================================


// ========================
// FORMAT DELIVERY AREA
// ========================

function formatAreaLabel(area) {
  if (!area) {
    return "";
  }

  if (area === "northeast") {
    return "North-East";
  }

  return (
    area.charAt(0).toUpperCase() +
    area.slice(1)
  );
}


// ========================
// BUILD ORDER MESSAGE
// ========================

export function buildOrderMessage(
  data,
  cart,
  deliveryFee,
  total,
  orderNumber,
  paymentMethod = "whatsapp"
) {
  let message =
    `Hello! My name is ${data.name}.\n`;

  message +=
    `I'd like to order from WAYAKI Sushibake.\n\n`;

  message +=
    `Order No: ${orderNumber}\n\n`;

  message +=
    `Order Date: ${data.orderDate}\n`;

  message +=
    `Preferred Time: ${data.pickupTime}\n\n`;

  message +=
    "Order:\n";


  // ========================
  // CART ITEMS
  // ========================

  cart.forEach((item) => {
    message +=
      `• ${item.name} x ${item.qty}` +
      ` — $${Number(
        item.finalPrice
      ).toFixed(2)}\n`;


    // WAYAKI TRIO

    if (
      item.id === "trio" &&
      Array.isArray(item.trays)
    ) {
      item.trays.forEach((tray) => {
        message +=
          `  Tray ${tray.trayNumber}: ` +
          `${tray.flavour}\n`;

        if (tray.base) {
          message +=
            `    Base: ${tray.base}\n`;
        }

        if (tray.portion) {
          message +=
            `    Portion: ${tray.portion}\n`;
        }

        if (tray.removed?.length) {
          message +=
            `    No: ` +
            `${tray.removed.join(", ")}\n`;
        }
      });
    }


    // DOUBLE-UP

    else if (
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

      if (item.base) {
        message +=
          `  Base: ${item.base}\n`;
      }
    }


    // NORMAL PRODUCT

    else {
      if (item.base) {
        message +=
          `  Base: ${item.base}\n`;
      }

      if (item.portion) {
        message +=
          `  Portion: ${item.portion}\n`;
      }

      if (
        item.removed?.length
      ) {
        message +=
          `  No: ` +
          `${item.removed.join(", ")}\n`;
      }
    }


    // UPGRADE

    if (
      item.upgrade &&
      item.upgrade !==
        "No Upgrade"
    ) {
      message +=
        `  Upgrade: ${item.upgrade}\n`;
    }


    // NOTES

    if (item.instructions) {
      message +=
        `  Note: ${item.instructions}\n`;
    }


    message += "\n";
  });


  // ========================
  // COLLECTION METHOD
  // ========================

  const methodLabel =
    data.method === "self"
      ? "Self-Collect"
      : "Delivery";

  message +=
    `Collection Method: ${methodLabel}\n`;


  // SELF COLLECTION

  if (
    data.method === "self"
  ) {
    message +=
      `Pick-up Location: ` +
      `${data.pickupLocation}\n`;
  }


  // DELIVERY

  else {
    message +=
      `Delivery Area: ` +
      `${formatAreaLabel(
        data.area
      )}\n`;

    if (
      Number(deliveryFee) === 0
    ) {
      message +=
        `Delivery Fee: FREE\n`;
    } else {
      message +=
        `Delivery Fee: ` +
        `$${Number(
          deliveryFee
        ).toFixed(2)}\n`;
    }

    message +=
      `Address: ${data.address}\n`;

    message +=
      `Postal Code: ${data.postal}\n`;

    message +=
      `Unit No: ${data.unit}\n`;
  }


  // ========================
  // CUSTOMER DETAILS
  // ========================

  message +=
    `\nContact Number: ${data.phone}\n`;

  message +=
    `Total: $${Number(
      total
    ).toFixed(2)}\n`;


  // ========================
  // PAYMENT METHOD
  // ========================

  if (
    paymentMethod === "paynow"
  ) {
    message +=
      `Payment Method: PayNow\n\n`;

    message +=
      `Payment proof uploaded successfully.\n`;

    message +=
      `Please verify my payment.`;
  } else {
    message +=
      `Payment Method: Arrange via WhatsApp`;
  }


  return message;
}


// ========================
// OPEN WHATSAPP
// ========================

export function openWhatsApp(
  message
) {
  const phone =
    "6584840768";

  const url =
    `https://wa.me/${phone}` +
    `?text=${encodeURIComponent(
      message
    )}`;

  window.location.href =
    url;
}