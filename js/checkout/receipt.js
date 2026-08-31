import {
  supabase
} from "../supabase-config.js";


// ================================================
// RECEIPT PAGE
// ================================================

const params =
  new URLSearchParams(
    window.location.search
  );

const orderNumber =
  params.get("order");

const receiptToken =
  params.get("key");


// ================================================
// DOM ELEMENTS
// ================================================

const newOrderButton =
  document.getElementById(
    "new-order-btn"
  );

const proofSection =
  document.getElementById(
    "receipt-proof-section"
  );

const proofImage =
  document.getElementById(
    "receipt-proof-image"
  );

const viewProofButton =
  document.getElementById(
    "view-proof-btn"
  );

const orderNumberElement =
  document.getElementById(
    "receipt-order-number"
  );

const nameElement =
  document.getElementById(
    "receipt-name"
  );

const dateElement =
  document.getElementById(
    "receipt-date"
  );

const timeElement =
  document.getElementById(
    "receipt-time"
  );

const methodElement =
  document.getElementById(
    "receipt-method"
  );

const itemsElement =
  document.getElementById(
    "receipt-items"
  );

const paymentElement =
  document.getElementById(
    "receipt-payment"
  );

const paymentStatusElement =
  document.getElementById(
    "payment-status"
  );

const totalElement =
  document.getElementById(
    "receipt-total"
  );

const nextMessageElement =
  document.getElementById(
    "receipt-next-message"
  );

const whatsappButton =
  document.getElementById(
    "send-whatsapp-btn"
  );


// ================================================
// INITIALISE
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  initialiseReceipt
);


async function initialiseReceipt() {

  if (
    !orderNumber ||
    !receiptToken
  ) {

    showReceiptError(
      "This receipt link is invalid."
    );

    return;
  }


  try {

    const {
      data,
      error
    } = await supabase.rpc(
      "get_order_receipt",
      {
        p_order_number:
          orderNumber,

        p_receipt_token:
          receiptToken
      }
    );


    if (error) {
      throw error;
    }


    if (!data) {
      throw new Error(
        "Receipt not found"
      );
    }


    console.log(
      "Receipt:",
      data
    );


    // ================================================
    // ORDER HAS REACHED RECEIPT
    // Clear completed shopping data
    // ================================================

    localStorage.removeItem(
    "sushibakeCart"
    );

    localStorage.removeItem(
    "wayakiCheckout"
    );


    // ================================================
    // SHOW RECEIPT
    // ================================================

    renderReceipt(
    data
    );

  } catch (error) {

    console.error(
      "Unable to load receipt:",
      error
    );

    showReceiptError(
      "We couldn't find this receipt."
    );
  }
}


// ================================================
// RENDER RECEIPT
// ================================================

function renderReceipt(
  receipt
) {

  orderNumberElement.textContent =
    receipt.order_number;


  nameElement.textContent =
    receipt.customer_name;


  dateElement.textContent =
    formatOrderDate(
      receipt.order_date
    );


  timeElement.textContent =
    receipt.preferred_time ||
    "Not specified";


  methodElement.textContent =
    formatFulfilmentMethod(
      receipt.fulfilment_method
    );


  paymentElement.textContent =
    formatPaymentMethod(
      receipt.payment_method
    );


  totalElement.textContent =
    `$${Number(
      receipt.customer_total
    ).toFixed(2)}`;


  renderPaymentStatus(
    receipt
  );

  renderPaymentProof(
    receipt
  );

  renderItems(
    receipt.items || []
  );


  renderNextStep(
    receipt
  );
}


// ================================================
// ITEMS
// ================================================

function renderItems(
  items
) {

  itemsElement.innerHTML = "";


  if (!items.length) {

    itemsElement.innerHTML =
      "<p>No items found.</p>";

    return;
  }


  items.forEach(
    (item) => {

      const container =
        document.createElement(
          "div"
        );

      container.className =
        "receipt-item";


      // ========================
      // ITEM SELECTIONS
      // ========================

      const selections =
        renderSelections(
          item.selections || []
        );


      // ========================
      // SPECIAL INSTRUCTIONS
      // ========================

      const instructions =
        item.instructions
          ? `
            <div class="receipt-item-note">
              Note: ${escapeHtml(
                item.instructions
              )}
            </div>
          `
          : "";


      // ========================
      // ITEM
      // ========================

      container.innerHTML = `
        <div class="receipt-item-top">

          <div class="receipt-item-name">
            ${escapeHtml(
              item.product_name
            )}
            ×${item.quantity}
          </div>

          <div class="receipt-item-price">
            $${Number(
              item.item_total
            ).toFixed(2)}
          </div>

        </div>

        <div class="receipt-item-details">
          ${selections}
          ${instructions}
        </div>
      `;


      itemsElement.appendChild(
        container
      );
    }
  );
}


// ================================================
// ITEM SELECTIONS
// ================================================

function renderSelections(
  selections
) {

  if (!selections.length) {
    return "";
  }


  const lines =
    selections.map(
      (selection) => {

        return `
          <div class="receipt-selection">
            ${escapeHtml(
              formatSelection(
                selection
              )
            )}
          </div>
        `;
      }
    ).join("");


  return `
    <div class="receipt-selections">
      ${lines}
    </div>
  `;
}


function formatSelection(
  selection
) {

  const value =
    String(
      selection.selection_value ||
      ""
    )
      .replaceAll(
        "_",
        " "
      );


  if (
    selection.selection_type ===
    "flavour"
  ) {

    return `Flavour: ${titleCase(
      value
    )}`;
  }


  if (
    selection.selection_type ===
    "upgrade"
  ) {

    return `Upgrade: ${titleCase(
      value
    )}`;
  }


  return titleCase(
    value
  );
}


// ================================================
// PAYMENT STATUS
// ================================================

function renderPaymentStatus(
  receipt
) {

  if (
    receipt.payment_method ===
    "paynow"
  ) {

    if (
      receipt
        .payment_proof_submitted
    ) {

      paymentStatusElement
        .textContent =
          "Payment proof submitted";

    } else {

      paymentStatusElement
        .textContent =
          "Waiting for payment proof";
    }

    return;
  }


  paymentStatusElement.textContent =
    formatStatus(
      receipt.payment_status
    );
}


// ================================================
// PAYMENT PROOF
// ================================================

async function renderPaymentProof(
  receipt
) {

  if (
    receipt.payment_method !==
      "paynow" ||
    !receipt
      .payment_proof_submitted
  ) {

    proofSection.style.display =
      "none";

    return;
  }


  try {

    // ========================
    // GET PRIVATE FILE PATH
    // ========================

    const {
      data:
        proofPath,
      error:
        proofError
    } =
      await supabase.rpc(
        "get_receipt_payment_proof",
        {
          p_order_number:
            orderNumber,

          p_receipt_token:
            receiptToken
        }
      );


    if (
      proofError
    ) {
      throw proofError;
    }


    if (!proofPath) {
      return;
    }


    // ========================
    // CREATE TEMPORARY URL
    // ========================

    const {
      data:
        signedData,
      error:
        signedError
    } =
      await supabase.storage
        .from(
          "payment-proofs"
        )
        .createSignedUrl(
          proofPath,
          60 * 10
        );


    if (
      signedError
    ) {
      throw signedError;
    }


    if (
      !signedData
        ?.signedUrl
    ) {
      return;
    }


    const signedUrl =
      signedData.signedUrl;


    // ========================
    // SHOW PROOF
    // ========================

    proofImage.src =
      signedUrl;


    proofSection.style.display =
      "block";


    // ========================
    // VIEW FULL IMAGE
    // ========================

    viewProofButton.onclick =
      () => {

        window.open(
          signedUrl,
          "_blank"
        );
      };


    proofImage.onclick =
      () => {

        window.open(
          signedUrl,
          "_blank"
        );
      };


  } catch (error) {

    console.error(
      "Unable to load payment proof:",
      error
    );
  }
}


// ================================================
// NEXT STEP
// ================================================

function renderNextStep(
  receipt
) {

  if (
    receipt.payment_method ===
    "paynow"
  ) {

    nextMessageElement.textContent =
      "Send your receipt to us on WhatsApp to complete your order.";

    whatsappButton.textContent =
      "Send Receipt to WhatsApp";

  } else {

    nextMessageElement.textContent =
      "Send your order to us on WhatsApp to complete your order.";

    whatsappButton.textContent =
      "Send Order to WhatsApp";
  }


  whatsappButton.addEventListener(
    "click",
    () => {
      openReceiptWhatsApp(
        receipt
      );
    },
    {
      once: true
    }
  );
}


// ================================================
// WHATSAPP
// ================================================

function openReceiptWhatsApp(
  receipt
) {

  const message =
    buildReceiptMessage(
      receipt
    );


  const url =
    "https://wa.me/6584840768" +
    "?text=" +
    encodeURIComponent(
      message
    );


  window.open(
    url,
    "_blank"
  );
}


function buildReceiptMessage(
  receipt
) {

  const paymentText =
    receipt.payment_method ===
      "paynow"
      ? "PayNow"
      : "WhatsApp";


  // ========================
  // PUBLIC RECEIPT LINK
  // ========================

  const receiptLink =
    `https://wayaki.github.io/sushibake/pages/receipt.html?order=${encodeURIComponent(
      orderNumber
    )}&key=${encodeURIComponent(
      receiptToken
    )}`;


  return [
    "Hi WAYAKI! 🧡",
    "",
    `Order: ${receipt.order_number}`,
    `Name: ${receipt.customer_name}`,
    `Order Date: ${formatOrderDate(
      receipt.order_date
    )}`,
    `Payment: ${paymentText}`,
    `Total: $${Number(
      receipt.customer_total
    ).toFixed(2)}`,
    "",
    "Receipt:",
    receiptLink,
    "",
    "I'm sending my order confirmation."
  ].join("\n");
}

// ================================================
// START NEW ORDER
// Clear current browser order session
// ================================================

newOrderButton?.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "sushibakeCart"
    );

    localStorage.removeItem(
      "wayakiCheckout"
    );

    localStorage.removeItem(
      "wayakiPendingOrder"
    );

    window.location.href =
      "https://wayaki.github.io/sushibake/";
  }
);

// ================================================
// ERROR
// ================================================

function showReceiptError(
  message
) {

  const page =
    document.querySelector(
      ".receipt-page"
    );


  if (!page) {
    return;
  }


  page.innerHTML = `
    <section class="receipt-error">

      <h1>
        Receipt not found
      </h1>

      <p>
        ${escapeHtml(
          message
        )}
      </p>

      <a href="../index.html">
        Back to WAYAKI
      </a>

    </section>
  `;
}


// ================================================
// FORMATTING
// ================================================

function formatOrderDate(
  value
) {

  if (!value) {
    return "-";
  }


  const [
    year,
    month,
    day
  ] =
    value
      .split("-")
      .map(Number);


  const date =
    new Date(
      year,
      month - 1,
      day
    );


  return date.toLocaleDateString(
    "en-SG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


function formatFulfilmentMethod(
  value
) {

  if (value === "self") {
    return "Self-Collection";
  }


  if (value === "delivery") {
    return "Delivery";
  }


  return titleCase(
    value || "-"
  );
}


function formatPaymentMethod(
  value
) {

  if (value === "paynow") {
    return "PayNow";
  }


  if (value === "whatsapp") {
    return "WhatsApp";
  }


  return titleCase(
    value || "-"
  );
}


function formatStatus(
  value
) {

  return titleCase(
    String(
      value || "pending"
    ).replaceAll(
      "_",
      " "
    )
  );
}


function titleCase(
  value
) {

  return String(
    value
  )
    .split(" ")
    .map(
      (word) =>
        word
          ? word[0]
              .toUpperCase()
            +
            word.slice(1)
          : ""
    )
    .join(" ");
}


// ================================================
// SECURITY
// ================================================

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}