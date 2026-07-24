// ================================================
// Customer form data and validation
// ================================================


// ========================
// ORDER DATE VALUE
// Get the selected order date value
// ========================

function getSelectedOrderDateValue() {
  return document
    .getElementById("order-date")
    .value;
}


// ========================
// ORDER DATE LABEL
// Get the selected order date display text
// ========================

function getSelectedOrderDateLabel() {
  const select =
    document.getElementById(
      "order-date"
    );

  if (!select.value) {
    return "";
  }

  return (
    select.options[
      select.selectedIndex
    ]?.text || ""
  );
}


// ========================
// FORM DATA
// Collect all customer and checkout form data
// ========================

function getFormData() {
  return {
    orderDateValue:
      getSelectedOrderDateValue(),

    orderDate:
      getSelectedOrderDateLabel(),

    pickupTime:
      document
        .getElementById("pickup-time")
        .value
        .trim(),

    name:
      document
        .getElementById("name")
        .value
        .trim(),

    phone:
      document
        .getElementById("phone")
        .value
        .trim(),

    method:
      getSelectedMethod(),

    pickupLocation:
      document
        .getElementById(
          "pickup-location"
        )
        ?.innerText
        .trim() || "",

    area:
      document
        .getElementById("area")
        .value
        .trim(),

    address:
      document
        .getElementById("address")
        .value
        .trim(),

    postal:
      document
        .getElementById("postal")
        .value
        .trim(),

    unit:
      document
        .getElementById("unit")
        .value
        .trim()
  };
}


// ========================
// FORM VALIDATION
// Validate customer details and delivery requirements
// ========================

function validateForm(data) {
  if (!hasCartItems()) {
    return "Your cart is empty!";
  }

  if (!data.name) {
    return "Please enter your full name.";
  }

  if (!data.phone) {
    return "Please enter your phone number.";
  }

  if (!data.orderDateValue) {
    return "Please select an order date.";
  }

  if (!data.pickupTime) {
    return "Please select a preferred time.";
  }

  if (data.method === "delivery") {
    if (getTotalMainTrays() < 2) {
      return (
        "Delivery is available for minimum 2 trays."
      );
    }

    if (!data.area) {
      return (
        "Please select a delivery area."
      );
    }

    if (!data.address) {
      return (
        "Please enter your delivery address."
      );
    }

    if (!data.postal) {
      return (
        "Please enter your postal code."
      );
    }

    if (!/^\d{6}$/.test(data.postal)) {
      return (
        "Please enter a valid 6-digit postal code."
      );
    }

    if (!data.unit) {
      return (
        "Please enter your unit number."
      );
    }
  }

  return null;
}