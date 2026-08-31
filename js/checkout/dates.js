// ================================================
// Order date generation and cutoff logic
// ================================================


// ========================
// FORMAT DATE VALUE
// Convert a Date object into YYYY-MM-DD
// ========================

function formatDateValue(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


// ========================
// FORMAT DATE LABEL
// Convert a Date object into a user-friendly display format
// ========================

function formatDateLabel(date) {
  return date.toLocaleDateString(
    "en-SG",
    {
      weekday: "long",
      day: "numeric",
      month: "short"
    }
  );
}


// ========================
// ORDER CUTOFF
// Orders close at 8 PM the day before
// ========================

function getCutoffDate(orderDate) {
  const cutoff =
    new Date(orderDate);

  cutoff.setDate(
    cutoff.getDate() - 1
  );

  cutoff.setHours(
    20,
    0,
    0,
    0
  );

  return cutoff;
}


// ========================
// ORDER DATE OPTIONS
// Pre-orders open up to 2 weeks in advance
// Weekends are closed
// ========================

function populateOrderDates() {
  const select =
    document.getElementById(
      "order-date"
    );

  if (!select) {
    return;
  }


  // ========================
  // RESET DROPDOWN
  // ========================

  select.innerHTML =
    '<option value="">Select a date</option>';


  const now =
    new Date();


  // ========================
  // BOOKING WINDOW
  // Allow bookings up to 14 days ahead
  // ========================

  const bookingDaysAhead =
    14;


  // ========================
  // SOLD OUT / CLOSED DATES
  // Add dates here when needed
  // ========================

  const soldOutDates = [
    // "2026-09-04",
    // "2026-09-10"
  ];


  // ========================
  // GENERATE AVAILABLE DATES
  // ========================

  for (
    let i = 1;
    i <= bookingDaysAhead;
    i++
  ) {

    const date =
      new Date(now);

    date.setDate(
      now.getDate() + i
    );


    // ========================
    // CLOSE WEEKENDS
    // 0 = Sunday
    // 6 = Saturday
    // ========================

    if (
      date.getDay() === 0 ||
      date.getDay() === 6
    ) {
      continue;
    }


    // ========================
    // CUTOFF CHECK
    // Hide a date once its
    // 8 PM cutoff has passed
    // ========================

    if (
      now >
      getCutoffDate(date)
    ) {
      continue;
    }


    const value =
      formatDateValue(date);


    const option =
      document.createElement(
        "option"
      );


    option.value =
      value;

    option.textContent =
      formatDateLabel(date);


    // ========================
    // SOLD OUT DATE
    // Keep visible but disabled
    // ========================

    if (
      soldOutDates.includes(
        value
      )
    ) {

      option.disabled =
        true;

      option.textContent +=
        " — SOLD OUT";
    }


    select.appendChild(
      option
    );
  }
}


// ========================
// INITIALISE DATES
// ========================

document.addEventListener(
  "DOMContentLoaded",
  populateOrderDates
);