// ================================================
// Order date generation and cutoff logic
// ================================================


// ========================
// FORMAT DATE VALUE
// Convert a Date object into YYYY-MM-DD format
// ========================

function formatDateValue(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ========================
// FORMAT DATE LABEL
// Convert a Date object into a user-friendly display format
// ========================

function formatDateLabel(date) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "short"
  };

  return date.toLocaleDateString(
    "en-SG",
    options
  );
}


// ========================
// ORDER CUTOFF
// Return the order cutoff time for a selected delivery date
// ========================

function getCutoffDate(orderDate) {
  const cutoff =
    new Date(orderDate);

  cutoff.setDate(
    orderDate.getDate() - 1
  );

  // Orders close at 8:00 PM the day before
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
// Populate all available order dates in the dropdown
// ========================

function populateOrderDates() {
  const select =
    document.getElementById(
      "order-date"
    );

  select.innerHTML =
    '<option value="">Select a date</option>';

  const now = new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const lastDayOfMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  const openNextMonth =
    now.getDate() >=
    lastDayOfMonth - 1;

  const soldOutDates = [
    "2026-08-06",
    "2026-08-07"
  ];

  for (let i = 1; i <= 60; i++) {
    const date =
      new Date(now);

    date.setDate(
      now.getDate() + i
    );

    // Skip weekends (Saturday & Sunday)
    if (
      date.getDay() === 0 ||
      date.getDay() === 6
    ) {
      continue;
    }

    const dateYear =
      date.getFullYear();

    const dateMonth =
      date.getMonth();

    const isCurrentMonth =
      dateYear === currentYear &&
      dateMonth === currentMonth;

    const nextMonthDate =
      new Date(
        currentYear,
        currentMonth + 1,
        1
      );

    const isNextMonth =
      dateYear ===
        nextMonthDate.getFullYear() &&
      dateMonth ===
        nextMonthDate.getMonth();

    if (
      !openNextMonth &&
      !isCurrentMonth
    ) {
      continue;
    }

    if (
      openNextMonth &&
      !isCurrentMonth &&
      !isNextMonth
    ) {
      continue;
    }

    if (
      now > getCutoffDate(date)
    ) {
      continue;
    }

    const option =
      document.createElement(
        "option"
      );

    option.value =
      formatDateValue(date);

    option.textContent =
      formatDateLabel(date);

    if (
      soldOutDates.includes(
        option.value
      )
    ) {
      option.disabled = true;

      option.textContent +=
        " — SOLD OUT";
    }

    select.appendChild(option);
  }
}