// ================================================
// ADMIN ORDERS
// Display and filter WAYAKI customer orders
// ================================================

import {
  requireAdmin,
  logoutAdmin
} from "./auth.js";

import {
  getOrders
} from "../api/orders-api.js";


// ================================================
// PAGE STATE
// ================================================

let allOrders = [];

let currentStatus = "pending";

let searchQuery = "";


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


// ================================================
// PAYMENT FORMAT HELPERS
// ================================================

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
// ORDER CALCULATIONS
// ================================================

function calculateOrderSubtotal(order) {

  return (
    order.order_items || []
  ).reduce(
    (total, item) => {

      const unitPrice =
        Number(
          item.unit_price || 0
        );


      const quantity =
        Number(
          item.quantity || 0
        );


      return (
        total +
        unitPrice * quantity
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
// LOAD ORDERS
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
// ORDER SUMMARY
// ================================================

function updateOrderSummary() {

  const counts = {
    pending: 0,
    confirmed: 0,
    completed: 0
  };


  allOrders.forEach(
    (order) => {

      if (
        Object.hasOwn(
          counts,
          order.status
        )
      ) {

        counts[order.status]++;

      }

    }
  );


  const pending =
    document.getElementById(
      "pending-count"
    );


  const confirmed =
    document.getElementById(
      "confirmed-count"
    );


  const completed =
    document.getElementById(
      "completed-count"
    );


  if (pending) {
    pending.textContent =
      counts.pending;
  }


  if (confirmed) {
    confirmed.textContent =
      counts.confirmed;
  }


  if (completed) {
    completed.textContent =
      counts.completed;
  }

}


// ================================================
// FILTER ORDERS
// ================================================

function renderFilteredOrders() {

  let filteredOrders = [
    ...allOrders
  ];


  // ========================
  // STATUS
  // ========================

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


  // ========================
  // SEARCH
  // ========================

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


  renderOrders(
    filteredOrders
  );


  updateOrdersHeading();

}


// ================================================
// FILTER HEADING
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


  if (
    !title ||
    !description
  ) {
    return;
  }


  const labels = {

    pending: {
      title:
        "Pending Orders",

      description:
        "Orders waiting for confirmation."
    },


    confirmed: {
      title:
        "Confirmed Orders",

      description:
        "Orders confirmed and waiting to be completed."
    },


    completed: {
      title:
        "Completed Orders",

      description:
        "Orders that have been completed."
    },


    cancelled: {
      title:
        "Cancelled Orders",

      description:
        "Orders that were cancelled."
    },


    all: {
      title:
        "All Orders",

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
// ORDER CARD
// ================================================

function renderOrderCard(order) {

  const total =
    calculateOrderTotal(order);


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
            ${formatDate(
              order.order_date
            )}
            ·
            ${order.preferred_time || ""}
          </div>

        </div>


        <div class="order-card-statuses">

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


          <span
            class="
              payment-status
              payment-${
                order.payment_status ||
                "unknown"
              }
            "
          >
            ${formatPaymentMethod(
              order.payment_method
            )}
            ·
            ${formatPaymentStatus(
              order.payment_status
            )}
          </span>

        </div>

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

      </div>


      <div class="order-total">

        <span>
          Total
        </span>

        <strong>
          ${formatMoney(total)}
        </strong>

      </div>


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
// RENDER ORDER LIST
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
// ORDER ACTIONS
// ================================================

function setupOrderActions() {

  document.addEventListener(
    "click",
    (event) => {

      const viewButton =
        event.target.closest(
          ".order-view-btn"
        );


      if (!viewButton) {
        return;
      }


      const orderId =
        viewButton.dataset.orderId;


      window.location.href =
        `./order-detail.html?id=${encodeURIComponent(
          orderId
        )}`;

    }
  );

}


// ================================================
// STATUS TABS
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

          currentStatus =
            button.dataset.status;


          tabs.forEach(
            (tab) => {

              tab.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          renderFilteredOrders();

        }
      );

    }
  );

}


// ================================================
// ORDER SEARCH
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


// ================================================
// INITIALISE ORDERS PAGE
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


  // ========================
  // LOGOUT
  // ========================

  const logoutButton =
    document.getElementById(
      "admin-logout-btn"
    );


  logoutButton?.addEventListener(
    "click",
    logoutAdmin
  );


  // ========================
  // EVENTS
  // ========================

  setupOrderActions();

  setupStatusTabs();

  setupOrderSearch();


  // ========================
  // LOAD ORDERS
  // ========================

  await loadOrders();

}


// ================================================
// PAGE START
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  initialiseOrdersPage
);