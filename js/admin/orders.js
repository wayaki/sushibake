// ================================================
// ADMIN ORDERS
// Load, display and manage WAYAKI customer orders
// ================================================

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
// Store loaded orders and current filters
// ================================================

let allOrders = [];

let currentStatus =
  "pending";

let searchQuery =
  "";


// ================================================
// FORMAT HELPERS
// ================================================

// Convert number into money format.
// Example: 12.9 → $12.90
function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}


// Convert database date into readable format.
// Example: 2026-08-12 → 12 Aug 2026
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


// Convert database codes into readable labels.
// Example:
// salmon_deluxe → Salmon Deluxe
// upgrade_set   → Upgrade Set
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


// ================================================
// ORDER CALCULATIONS
// ================================================

// Calculate food subtotal only.
function calculateOrderSubtotal(order) {
  return (
    order.order_items || []
  ).reduce(
    (total, item) => {
      const unitPrice =
        Number(item.unit_price || 0);

      const quantity =
        Number(item.quantity || 0);

      return (
        total +
        unitPrice * quantity
      );
    },
    0
  );
}


// Calculate final customer total.
function calculateOrderTotal(order) {
  return (
    calculateOrderSubtotal(order) +
    Number(
      order.customer_delivery_paid || 0
    )
  );
}


// ================================================
// ORDER LOOKUP
// ================================================

// Find one loaded order using its UUID.
function findOrderById(orderId) {
  return allOrders.find(
    (order) =>
      order.id === orderId
  );
}


// ================================================
// LOAD ORDERS
// Retrieve latest order data from Supabase
// ================================================

async function loadOrders() {
  const loading =
    document.getElementById(
      "orders-loading"
    );

  const errorMessage =
    document.getElementById(
      "orders-error"
    );

  if (loading) {
    loading.hidden = false;
  }

  if (errorMessage) {
    errorMessage.hidden = true;
  }

  try {
    allOrders =
      await getOrders();

    console.log(
      "Admin orders:",
      allOrders
    );

    updateOrderSummary();
    renderFilteredOrders();

  } catch (error) {
    console.error(
      "Unable to load orders:",
      error
    );

    if (loading) {
      loading.hidden = true;
    }

    if (errorMessage) {
      errorMessage.hidden = false;
    }
  }
}


// ================================================
// SUMMARY
// Update Pending / Confirmed / Completed counts
// ================================================

function updateOrderSummary() {
  const counts = {
    pending: 0,
    confirmed: 0,
    completed: 0
  };

  allOrders.forEach((order) => {
    if (
      Object.hasOwn(
        counts,
        order.status
      )
    ) {
      counts[order.status]++;
    }
  });


  const pendingElement =
    document.getElementById(
      "pending-count"
    );

  const confirmedElement =
    document.getElementById(
      "confirmed-count"
    );

  const completedElement =
    document.getElementById(
      "completed-count"
    );


  if (pendingElement) {
    pendingElement.textContent =
      counts.pending;
  }

  if (confirmedElement) {
    confirmedElement.textContent =
      counts.confirmed;
  }

  if (completedElement) {
    completedElement.textContent =
      counts.completed;
  }
}



// ================================================
// FILTER ORDERS
// Apply status and search filters
// before rendering the order list
// ================================================

function renderFilteredOrders() {
  let filteredOrders =
    [...allOrders];


  // ============================================
  // STATUS FILTER
  //
  // pending
  // confirmed
  // completed
  // cancelled
  // all
  // ============================================

  if (
    currentStatus !== "all"
  ) {
    filteredOrders =
      filteredOrders.filter(
        (order) =>
          order.status ===
          currentStatus
      );
  }


  // ============================================
  // SEARCH FILTER
  //
  // Search by:
  // - Order number
  // - Customer name
  // - Customer phone
  // ============================================

  if (searchQuery) {
    const query =
      searchQuery
        .trim()
        .toLowerCase();


    filteredOrders =
      filteredOrders.filter(
        (order) => {

          const orderNumber =
            order.order_number
              ?.toLowerCase() ||
            "";

          const customerName =
            order.customer_name
              ?.toLowerCase() ||
            "";

          const customerPhone =
            order.customer_phone ||
            "";


          return (
            orderNumber.includes(
              query
            ) ||

            customerName.includes(
              query
            ) ||

            customerPhone.includes(
              query
            )
          );
        }
      );
  }


  // ============================================
  // RENDER RESULT
  // ============================================

  renderOrders(
    filteredOrders
  );


  // Update title/description
  // based on selected status tab
  updateOrdersHeading();
}



// ================================================
// FILTER HEADING
// Update heading when changing status tabs
// ================================================

function updateOrdersHeading() {
  const title =
    document.getElementById(
      "orders-list-title"
    );

  const description =
    document.getElementById(
      "orders-list-description"
    );

  if (!title || !description) {
    return;
  }

  const labels = {
    pending: {
      title: "Pending Orders",
      description:
        "Orders waiting for confirmation."
    },

    confirmed: {
      title: "Confirmed Orders",
      description:
        "Orders confirmed and waiting to be completed."
    },

    completed: {
      title: "Completed Orders",
      description:
        "Orders that have been completed."
    },

    cancelled: {
      title: "Cancelled Orders",
      description:
        "Orders that were cancelled."
    },

    all: {
      title: "All Orders",
      description:
        "View all customer orders."
    }
  };

  const selected =
    labels[currentStatus] ||
    labels.all;

  title.textContent =
    selected.title;

  description.textContent =
    selected.description;
}


// ================================================
// SELECTION RENDERING
// Display item customisation
// ================================================

function renderSelections(item) {
  const selections =
    item.item_selections || [];

  const ungrouped =
    selections.filter(
      (selection) =>
        selection.selection_group == null
    );

  const grouped =
    selections.filter(
      (selection) =>
        selection.selection_group != null
    );

  let html = "";


  // --------------------------------
  // Ungrouped selections
  // Regular tray options,
  // Double-Up base, upgrades, etc.
  // --------------------------------

  ungrouped.forEach((selection) => {
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
  });


  // --------------------------------
  // Grouped selections
  // Trio trays / Double-Up halves
  // --------------------------------

  const groups = {};

  grouped.forEach((selection) => {
    const group =
      selection.selection_group;

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(
      selection
    );
  });


  Object.entries(groups)
    .sort(
      ([a], [b]) =>
        Number(a) - Number(b)
    )
    .forEach(
      (
        [
          groupNumber,
          groupSelections
        ]
      ) => {

        const groupLabel =
          item.products?.code ===
          "wayaki_trio"
            ? `Tray ${groupNumber}`
            : `Half ${groupNumber}`;

        html += `
          <div
            class="order-selection-group"
          >
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
// ORDER ITEM
// Render one purchased product
// ================================================

function renderOrderItem(item) {
  const quantity =
    Number(item.quantity || 0);

  const lineTotal =
    Number(
      item.unit_price || 0
    ) * quantity;

  return `
    <div class="order-item">

      <div class="order-item-header">

        <span>
          ${item.products?.name || "Item"}
          × ${quantity}
        </span>

        <span>
          ${formatMoney(lineTotal)}
        </span>

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
// ORDER CARD
// Render one order in the list
// ================================================

function renderOrderCard(order) {
  const subtotal =
    calculateOrderSubtotal(order);

  const total =
    calculateOrderTotal(order);

  const deliveryFee =
    Number(
      order.customer_delivery_paid || 0
    );

  const isDelivery =
    order.fulfilment_method ===
    "delivery";

  const methodLabel =
    isDelivery
      ? "Delivery"
      : "Self-Collect";


  return `
    <article class="order-card">

      <div class="order-card-header">

        <div>

          <h3 class="order-number">
            ${order.order_number}
          </h3>

          <div class="order-meta">
            ${formatDate(order.order_date)}
            ·
            ${order.preferred_time || ""}
          </div>

        </div>


        <span
          class="order-status ${order.status}"
        >
          ${formatCode(order.status)}
        </span>

      </div>


      <div class="order-customer">

        <div class="order-customer-name">
          ${order.customer_name}
        </div>

        <div class="order-customer-detail">
          ${order.customer_phone}
          ·
          ${methodLabel}
        </div>

        ${
          isDelivery
            ? `
              <div class="order-customer-detail">
                ${
                  order.delivery_address ||
                  ""
                }
              </div>
            `
            : ""
        }

      </div>


      <div class="order-items">

        ${
          (order.order_items || [])
            .map(renderOrderItem)
            .join("")
        }

      </div>


      <div class="order-total">

        <span>
          Total
        </span>

        <span>
          ${formatMoney(total)}
        </span>

      </div>


      ${
        deliveryFee > 0
          ? `
            <div class="order-meta">
              Food:
              ${formatMoney(subtotal)}
              ·
              Delivery:
              ${formatMoney(deliveryFee)}
            </div>
          `
          : ""
      }


      <div class="order-actions">

        <button
          type="button"
          class="order-view-btn"
          data-order-id="${order.id}"
        >
          View Order
        </button>

      </div>

    </article>
  `;
}


// ================================================
// ORDER LIST
// Render all filtered order cards
// ================================================

function renderOrders(orders) {
  const list =
    document.getElementById(
      "orders-list"
    );

  const loading =
    document.getElementById(
      "orders-loading"
    );

  const empty =
    document.getElementById(
      "orders-empty"
    );

  if (!list) {
    return;
  }

  if (loading) {
    loading.hidden = true;
  }

  if (!orders.length) {
    list.innerHTML = "";

    if (empty) {
      empty.hidden = false;
    }

    return;
  }

  if (empty) {
    empty.hidden = true;
  }

  list.innerHTML =
    orders
      .map(renderOrderCard)
      .join("");
}


// ================================================
// ORDER MODAL
// Render complete order information
// ================================================

function renderOrderModal(order) {
  const modalContent =
    document.getElementById(
      "order-modal-content"
    );

  if (!modalContent) {
    return;
  }

  const subtotal =
    calculateOrderSubtotal(order);

  const deliveryFee =
    Number(
      order.customer_delivery_paid || 0
    );

  const total =
    calculateOrderTotal(order);

  const isDelivery =
    order.fulfilment_method ===
    "delivery";


  modalContent.innerHTML = `

    <!-- Order Header -->

    <div class="modal-order-header">

      <div>

        <h2>
          ${order.order_number}
        </h2>

        <p>
          ${formatDate(order.order_date)}
          ·
          ${order.preferred_time || ""}
        </p>

      </div>


      <span
        class="order-status ${order.status}"
      >
        ${formatCode(order.status)}
      </span>

    </div>


    <!-- Customer -->

    <section class="modal-order-section">

      <h3>
        Customer
      </h3>


      <div class="modal-detail-row">

        <span>
          Name
        </span>

        <strong>
          ${order.customer_name}
        </strong>

      </div>


      <div class="modal-detail-row">

        <span>
          Phone
        </span>

        <strong>
          ${order.customer_phone}
        </strong>

      </div>

    </section>


    <!-- Fulfilment -->

    <section class="modal-order-section">

      <h3>
        Fulfilment
      </h3>


      <div class="modal-detail-row">

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
            <div class="modal-detail-row">

              <span>
                Area
              </span>

              <strong>
                ${formatCode(
                  order.delivery_area
                )}
              </strong>

            </div>


            <div class="modal-address">
              ${
                order.delivery_address ||
                ""
              }
            </div>
          `
          : ""
      }

    </section>


    <!-- Items -->

    <section class="modal-order-section">

      <h3>
        Order
      </h3>


      <div class="order-items">

        ${
          (order.order_items || [])
            .map(renderOrderItem)
            .join("")
        }

      </div>

    </section>


    <!-- Customer Notes -->

    ${
      order.customer_notes
        ? `
          <section
            class="modal-order-section"
          >

            <h3>
              Customer Note
            </h3>

            <div class="modal-note">
              ${order.customer_notes}
            </div>

          </section>
        `
        : ""
    }


    <!-- Payment -->

    <section class="modal-order-section">

      <h3>
        Payment Summary
      </h3>


      <div class="modal-detail-row">

        <span>
          Food
        </span>

        <strong>
          ${formatMoney(subtotal)}
        </strong>

      </div>


      <div class="modal-detail-row">

        <span>
          Delivery
        </span>

        <strong>
          ${
            deliveryFee > 0
              ? formatMoney(deliveryFee)
              : "—"
          }
        </strong>

      </div>


      <div class="modal-total-row">

        <span>
          Total
        </span>

        <strong>
          ${formatMoney(total)}
        </strong>

      </div>

    </section>


    <!-- Order Actions -->

    ${renderModalActions(order)}

  `;
}


// ================================================
// MODAL ACTIONS
// Display available actions based on status
// ================================================

function renderModalActions(order) {
  if (
    order.status === "completed" ||
    order.status === "cancelled"
  ) {
    return "";
  }


  let buttons = "";


  if (order.status === "pending") {
    buttons += `
      <button
        type="button"
        class="order-confirm-btn"
        data-order-id="${order.id}"
      >
        Confirm Order
      </button>
    `;
  }


  if (order.status === "confirmed") {
    buttons += `
      <button
        type="button"
        class="order-complete-btn"
        data-order-id="${order.id}"
      >
        Complete Order
      </button>
    `;
  }


  buttons += `
    <button
      type="button"
      class="order-cancel-btn"
      data-order-id="${order.id}"
    >
      Cancel Order
    </button>
  `;


  return `
    <section class="modal-order-section">

      <div class="modal-order-actions">
        ${buttons}
      </div>

    </section>
  `;
}


// ================================================
// OPEN MODAL
// ================================================

function openOrderModal(orderId) {
  const order =
    findOrderById(orderId);

  if (!order) {
    console.error(
      "Order not found:",
      orderId
    );

    return;
  }

  renderOrderModal(order);

  const modal =
    document.getElementById(
      "order-modal"
    );

  modal?.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}


// ================================================
// CLOSE MODAL
// ================================================

function closeOrderModal() {
  const modal =
    document.getElementById(
      "order-modal"
    );

  modal?.classList.add(
    "hidden"
  );

  document.body.style.overflow =
    "";
}


// ================================================
// CHANGE ORDER STATUS
// Shared handler for Confirm / Complete / Cancel
// ================================================

async function handleOrderStatusChange(
  orderId,
  newStatus
) {
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
      orderId,
      newStatus
    );

    closeOrderModal();

    // Reload latest database state
    await loadOrders();

  } catch (error) {
    console.error(
      "Order status update error:",
      error
    );

    alert(
      "Unable to update order. Please try again."
    );
  }
}


// ================================================
// ORDER ACTIONS
// Handle buttons from cards AND modal
// ================================================

function setupOrderActions() {

  document.addEventListener(
    "click",
    async (event) => {

      // ------------------------
      // View
      // ------------------------

      const viewButton =
        event.target.closest(
          ".order-view-btn"
        );

      if (viewButton) {
        openOrderModal(
          viewButton.dataset.orderId
        );

        return;
      }


      // ------------------------
      // Confirm
      // ------------------------

      const confirmButton =
        event.target.closest(
          ".order-confirm-btn"
        );

      if (confirmButton) {
        await handleOrderStatusChange(
          confirmButton.dataset.orderId,
          "confirmed"
        );

        return;
      }


      // ------------------------
      // Complete
      // ------------------------

      const completeButton =
        event.target.closest(
          ".order-complete-btn"
        );

      if (completeButton) {
        await handleOrderStatusChange(
          completeButton.dataset.orderId,
          "completed"
        );

        return;
      }


      // ------------------------
      // Cancel
      // ------------------------

      const cancelButton =
        event.target.closest(
          ".order-cancel-btn"
        );

      if (cancelButton) {
        await handleOrderStatusChange(
          cancelButton.dataset.orderId,
          "cancelled"
        );
      }

    }
  );
}

// ================================================
// STATUS TABS
// Change current order status filter
// ================================================

function setupStatusTabs() {
  const tabs =
    document.querySelectorAll(
      ".status-tab"
    );


  tabs.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          // Save selected status
          currentStatus =
            button.dataset.status;


          // Remove active class
          // from every tab
          tabs.forEach(
            (tab) => {
              tab.classList.remove(
                "active"
              );
            }
          );


          // Highlight current tab
          button.classList.add(
            "active"
          );


          // Re-render orders
          renderFilteredOrders();
        }
      );
    }
  );
}

// ================================================
// MODAL EVENTS
// ================================================

function setupModalEvents() {
  const closeButton =
    document.getElementById(
      "close-order-modal"
    );

  const backdrop =
    document.querySelector(
      ".order-modal-backdrop"
    );


  closeButton?.addEventListener(
    "click",
    closeOrderModal
  );


  backdrop?.addEventListener(
    "click",
    closeOrderModal
  );


  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeOrderModal();
      }
    }
  );
}


// ================================================
// INITIALISE ORDERS PAGE
// Authenticate admin, register events,
// then load the latest orders
// ================================================

async function initialiseOrdersPage() {

  const session =
    await requireAdmin();

  if (!session) {
    return;
  }


  console.log(
    "Admin authenticated:",
    session.user.email
  );


  // ------------------------
  // Logout
  // ------------------------

  const logoutButton =
    document.getElementById(
      "admin-logout-btn"
    );

  logoutButton?.addEventListener(
    "click",
    logoutAdmin
  );


  // ------------------------
  // Page events
  // ------------------------

  setupOrderActions();
  setupStatusTabs();
  setupOrderSearch();
  setupModalEvents();


  // ------------------------
  // Initial data
  // ------------------------

  await loadOrders();
}


// ================================================
// PAGE START
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  initialiseOrdersPage
);

// ================================================
// ORDER SEARCH
// Filter orders while admin types
// ================================================

function setupOrderSearch() {
  const searchInput =
    document.getElementById(
      "order-search"
    );


  if (!searchInput) {
    return;
  }


  searchInput.addEventListener(
    "input",
    () => {

      searchQuery =
        searchInput.value
          .trim()
          .toLowerCase();


      renderFilteredOrders();
    }
  );
}

