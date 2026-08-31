// ================================================
// ADMIN ORDER DETAIL
// Display and manage one WAYAKI order
// ================================================

import {
  supabase
} from "../supabase-config.js";

import {
  requireAdmin,
  logoutAdmin
} from "./auth.js";

import {
  getOrders,
  updateOrderStatus
} from "../api/orders-api.js";


// ================================================
// PAGE STATE
// ================================================

let currentOrder = null;


// ================================================
// FORMAT HELPERS
// ================================================

function formatMoney(value) {

  return `$${Number(
    value || 0
  ).toFixed(2)}`;

}


function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }


  return new Date(
    `${dateValue}T00:00:00`
  ).toLocaleDateString(
    "en-SG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function formatCode(value) {

  if (!value) {
    return "";
  }


  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

}


function formatPaymentMethod(value) {

  if (value === "paynow") {
    return "PayNow";
  }


  if (value === "whatsapp") {
    return "WhatsApp";
  }


  return "Not Selected";

}


function formatPaymentStatus(value) {

  if (!value) {
    return "Unknown";
  }


  return formatCode(value);

}


// ================================================
// CALCULATIONS
// ================================================

function calculateOrderSubtotal(order) {

  return (
    order.order_items || []
  ).reduce(
    (total, item) => {

      return (
        total +
        Number(
          item.unit_price || 0
        ) *
        Number(
          item.quantity || 0
        )
      );

    },
    0
  );

}


function calculateOrderTotal(order) {

  return (
    calculateOrderSubtotal(order) +
    Number(
      order.customer_delivery_paid ||
        0
    )
  );

}


// ================================================
// GET ORDER ID
// Read UUID from ?id=
// ================================================

function getOrderId() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return params.get("id");

}


// ================================================
// RENDER SELECTIONS
// ================================================

function renderSelections(item) {

  const selections =
    item.item_selections || [];


  const ungrouped =
    selections.filter(
      (selection) =>
        selection.selection_group ==
        null
    );


  const grouped =
    selections.filter(
      (selection) =>
        selection.selection_group !=
        null
    );


  let html = "";


  // ========================
  // UNGROUPED
  // ========================

  ungrouped.forEach(
    (selection) => {

      const type =
        selection.selection_type;


      const value =
        formatCode(
          selection.selection_value
        );


      if (type === "upgrade") {

        html += `
          <div>
            Upgrade:
            ${value}
          </div>
        `;

        return;

      }


      if (type === "removed") {

        html += `
          <div>
            No:
            ${value}
          </div>
        `;

        return;

      }


      html += `
        <div>
          ${formatCode(type)}:
          ${value}
        </div>
      `;

    }
  );


  // ========================
  // GROUPED
  // ========================

  const groups = {};


  grouped.forEach(
    (selection) => {

      const group =
        selection.selection_group;


      if (!groups[group]) {
        groups[group] = [];
      }


      groups[group].push(
        selection
      );

    }
  );


  Object.entries(groups)
    .sort(
      ([a], [b]) =>
        Number(a) - Number(b)
    )
    .forEach(
      ([
        groupNumber,
        groupSelections
      ]) => {

        const groupLabel =
          item.products?.code ===
          "wayaki_trio"
            ? `Tray ${groupNumber}`
            : `Half ${groupNumber}`;


        html += `
          <div class="order-selection-group">

            <strong>
              ${groupLabel}
            </strong>
        `;


        groupSelections.forEach(
          (selection) => {

            const type =
              selection.selection_type;


            const value =
              formatCode(
                selection.selection_value
              );


            if (
              type === "removed"
            ) {

              html += `
                <div>
                  No:
                  ${value}
                </div>
              `;

              return;

            }


            html += `
              <div>
                ${formatCode(type)}:
                ${value}
              </div>
            `;

          }
        );


        html += `
          </div>
        `;

      }
    );


  return html;

}


// ================================================
// RENDER ORDER ITEM
// ================================================

function renderOrderItem(item) {

  const quantity =
    Number(
      item.quantity || 0
    );


  const lineTotal =
    Number(
      item.unit_price || 0
    ) * quantity;


  return `
    <div class="order-item">

      <div class="order-item-header">

        <strong>
          ${item.products?.name || "Item"}
          × ${quantity}
        </strong>


        <strong>
          ${formatMoney(
            lineTotal
          )}
        </strong>

      </div>


      <div class="order-item-details">

        ${renderSelections(item)}


        ${
          item.item_notes
            ? `
              <div>
                Note:
                ${item.item_notes}
              </div>
            `
            : ""
        }

      </div>

    </div>
  `;

}


// ================================================
// RENDER ORDER ACTIONS
// ================================================

function renderOrderActions(order) {

  if (
    order.status === "completed" ||
    order.status === "cancelled"
  ) {
    return "";
  }


  let buttons = "";


  if (
    order.status === "pending"
  ) {

    buttons += `
      <button
        type="button"
        class="order-confirm-btn"
      >
        Confirm Order
      </button>
    `;

  }


  if (
    order.status === "confirmed"
  ) {

    buttons += `
      <button
        type="button"
        class="order-complete-btn"
      >
        Complete Order
      </button>
    `;

  }


  buttons += `
    <button
      type="button"
      class="order-cancel-btn"
    >
      Cancel Order
    </button>
  `;


  return `
    <section class="order-detail-section">

      <h2>
        Order Actions
      </h2>

      <div class="order-detail-actions">
        ${buttons}
      </div>

    </section>
  `;

}


// ================================================
// RENDER ORDER
// ================================================

function renderOrder(order) {

  const container =
    document.getElementById(
      "order-detail"
    );


  if (!container) {
    return;
  }


  const subtotal =
    calculateOrderSubtotal(order);


  const deliveryFee =
    Number(
      order.customer_delivery_paid ||
        0
    );


  const total =
    calculateOrderTotal(order);


  const isDelivery =
    order.fulfilment_method ===
    "delivery";


  container.innerHTML = `

    <!-- ========================
         ORDER HEADER
    ======================== -->

    <section class="order-detail-header">

      <div>

        <span class="order-detail-label">
          Order
        </span>

        <h1>
          ${order.order_number}
        </h1>

        <p>
          ${formatDate(
            order.order_date
          )}
          ·
          ${order.preferred_time || ""}
        </p>

      </div>


      <span
        class="
          order-status
          ${order.status}
        "
      >
        ${formatCode(
          order.status
        )}
      </span>

    </section>


    <!-- ========================
         CUSTOMER
    ======================== -->

    <section class="order-detail-section">

      <h2>
        Customer
      </h2>


      <div class="detail-row">

        <span>
          Name
        </span>

        <strong>
          ${order.customer_name}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Phone
        </span>

        <strong>
          ${order.customer_phone}
        </strong>

      </div>

    </section>


    <!-- ========================
         FULFILMENT
    ======================== -->

    <section class="order-detail-section">

      <h2>
        Fulfilment
      </h2>


      <div class="detail-row">

        <span>
          Method
        </span>

        <strong>
          ${
            isDelivery
              ? "Delivery"
              : "Self-Collect"
          }
        </strong>

      </div>


      ${
        isDelivery
          ? `
            <div class="detail-row">

              <span>
                Area
              </span>

              <strong>
                ${formatCode(
                  order.delivery_area
                )}
              </strong>

            </div>


            <div class="detail-address">
              ${
                order.delivery_address ||
                ""
              }
            </div>
          `
          : ""
      }

    </section>


    <!-- ========================
         ORDER ITEMS
    ======================== -->

    <section class="order-detail-section">

      <h2>
        Order
      </h2>


      <div class="order-items">

        ${
          (
            order.order_items ||
            []
          )
            .map(
              renderOrderItem
            )
            .join("")
        }

      </div>

    </section>


    <!-- ========================
         CUSTOMER NOTE
    ======================== -->

    ${
      order.customer_notes
        ? `
          <section class="order-detail-section">

            <h2>
              Customer Note
            </h2>

            <div class="detail-note">
              ${order.customer_notes}
            </div>

          </section>
        `
        : ""
    }


    <!-- ========================
         PAYMENT
    ======================== -->

    <section class="order-detail-section">

      <h2>
        Payment
      </h2>


      <div class="detail-row">

        <span>
          Method
        </span>

        <strong>
          ${formatPaymentMethod(
            order.payment_method
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Status
        </span>

        <strong
          class="
            payment-status-text
            payment-${
              order.payment_status ||
              "unknown"
            }
          "
        >
          ${formatPaymentStatus(
            order.payment_status
          )}
        </strong>

      </div>


      ${
        order.paid_at
          ? `
            <div class="detail-row">

              <span>
                Paid At
              </span>

              <strong>
                ${new Date(
                  order.paid_at
                ).toLocaleString(
                  "en-SG"
                )}
              </strong>

            </div>
          `
          : ""
      }


      ${
        order.payment_method ===
        "paynow"
          ? `
            <div class="admin-payment-proof">

              <div class="payment-proof-title">
                Payment Proof
              </div>


              ${
                order.payment_proof_path
                  ? `
                    <div
                      class="payment-proof-image-wrapper"
                    >

                      <div
                        id="payment-proof-loading"
                        class="payment-proof-loading"
                      >
                        Loading payment proof...
                      </div>


                      <img
                        id="payment-proof-image"
                        class="payment-proof-image"
                        alt="Payment proof for ${order.order_number}"
                        hidden
                      />

                    </div>
                  `
                  : `
                    <div class="proof-missing">
                      No payment proof uploaded.
                    </div>
                  `
              }

            </div>
          `
          : ""
      }


      ${
        order.payment_status !==
        "paid"
          ? `
            <button
              type="button"
              class="mark-paid-btn"
            >
              Mark as Paid
            </button>
          `
          : `
            <div class="payment-paid-label">
              ✓ Payment Verified
            </div>
          `
      }

    </section>


    <!-- ========================
         TOTAL
    ======================== -->

    <section class="order-detail-section">

      <h2>
        Order Total
      </h2>


      <div class="detail-row">

        <span>
          Food
        </span>

        <strong>
          ${formatMoney(
            subtotal
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Delivery
        </span>

        <strong>
          ${
            deliveryFee > 0
              ? formatMoney(
                  deliveryFee
                )
              : "—"
          }
        </strong>

      </div>


      <div class="detail-total-row">

        <span>
          Total
        </span>

        <strong>
          ${formatMoney(total)}
        </strong>

      </div>

    </section>


    ${renderOrderActions(order)}

  `;

}


// ================================================
// LOAD PAYMENT PROOF
// ================================================

async function loadPaymentProof(order) {

  if (
    order.payment_method !==
      "paynow" ||
    !order.payment_proof_path
  ) {
    return;
  }


  const proofImage =
    document.getElementById(
      "payment-proof-image"
    );


  const loading =
    document.getElementById(
      "payment-proof-loading"
    );


  if (!proofImage) {
    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabase
        .storage
        .from(
          "payment-proofs"
        )
        .createSignedUrl(
          order.payment_proof_path,
          300
        );


    if (error) {
      throw error;
    }


    proofImage.src =
      data.signedUrl;


    proofImage.onload =
      () => {

        if (loading) {
          loading.hidden =
            true;
        }


        proofImage.hidden =
          false;

      };


  } catch (error) {

    console.error(
      "Payment proof error:",
      error
    );


    if (loading) {

      loading.textContent =
        "Unable to load payment proof.";

    }

  }

}


// ================================================
// MARK PAYMENT AS PAID
// ================================================

async function markOrderAsPaid() {

  if (!currentOrder) {
    return;
  }


  const confirmed =
    window.confirm(
      "Have you verified this payment?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const {
      error
    } =
      await supabase
        .from("orders")
        .update({
          payment_status:
            "paid",

          paid_at:
            new Date()
              .toISOString()
        })
        .eq(
          "id",
          currentOrder.id
        );


    if (error) {
      throw error;
    }


    await loadOrder();


  } catch (error) {

    console.error(
      "Payment update error:",
      error
    );


    alert(
      "Unable to update payment status."
    );

  }

}


// ================================================
// CHANGE ORDER STATUS
// ================================================

async function changeOrderStatus(
  newStatus
) {

  if (!currentOrder) {
    return;
  }


  const messages = {

    confirmed:
      "Confirm this order?",

    completed:
      "Mark this order as completed?",

    cancelled:
      "Cancel this order?"

  };


  const confirmed =
    window.confirm(
      messages[newStatus] ||
      "Update this order?"
    );


  if (!confirmed) {
    return;
  }


  try {

    await updateOrderStatus(
      currentOrder.id,
      newStatus
    );


    await loadOrder();


  } catch (error) {

    console.error(
      "Order update error:",
      error
    );


    alert(
      "Unable to update order."
    );

  }

}


// ================================================
// PAGE ACTIONS
// ================================================

function setupActions() {

  document.addEventListener(
    "click",
    async (event) => {

      if (
        event.target.closest(
          ".mark-paid-btn"
        )
      ) {

        await markOrderAsPaid();

        return;

      }


      if (
        event.target.closest(
          ".order-confirm-btn"
        )
      ) {

        await changeOrderStatus(
          "confirmed"
        );

        return;

      }


      if (
        event.target.closest(
          ".order-complete-btn"
        )
      ) {

        await changeOrderStatus(
          "completed"
        );

        return;

      }


      if (
        event.target.closest(
          ".order-cancel-btn"
        )
      ) {

        await changeOrderStatus(
          "cancelled"
        );

      }

    }
  );

}


// ================================================
// LOAD ONE ORDER
// ================================================

async function loadOrder() {

  const orderId =
    getOrderId();


  if (!orderId) {

    showOrderError(
      "Order ID is missing."
    );

    return;

  }


  try {

    const orders =
      await getOrders();


    currentOrder =
      orders.find(
        (order) =>
          order.id === orderId
      );


    if (!currentOrder) {

      showOrderError(
        "Order was not found."
      );

      return;

    }


    renderOrder(
      currentOrder
    );


    await loadPaymentProof(
      currentOrder
    );


  } catch (error) {

    console.error(
      "Unable to load order:",
      error
    );


    showOrderError(
      "Unable to load order."
    );

  }

}


// ================================================
// ERROR
// ================================================

function showOrderError(message) {

  const loading =
    document.getElementById(
      "order-detail-loading"
    );


  const error =
    document.getElementById(
      "order-detail-error"
    );


  if (loading) {
    loading.hidden = true;
  }


  if (error) {

    error.textContent =
      message;

    error.hidden =
      false;

  }

}


// ================================================
// INITIALISE
// ================================================

async function initialiseOrderDetail() {

  const session =
    await requireAdmin();


  if (!session) {
    return;
  }


  // ========================
  // LOGOUT
  // ========================

  document
    .getElementById(
      "admin-logout-btn"
    )
    ?.addEventListener(
      "click",
      logoutAdmin
    );


  // ========================
  // EVENTS
  // ========================

  setupActions();


  // ========================
  // LOAD ORDER
  // ========================

  await loadOrder();


  const loading =
    document.getElementById(
      "order-detail-loading"
    );


  if (loading) {
    loading.hidden = true;
  }

}


// ================================================
// PAGE START
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  initialiseOrderDetail
);