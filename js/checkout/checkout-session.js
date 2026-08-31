// ================================================
// WAYAKI CHECKOUT SESSION
// ================================================

const CHECKOUT_SESSION_KEY =
  "wayakiCheckoutSession";


// ================================================
// GET CHECKOUT SESSION
// ================================================

export function getCheckoutSession() {

  const savedSession =
    localStorage.getItem(
      CHECKOUT_SESSION_KEY
    );


  if (!savedSession) {
    return null;
  }


  try {

    return JSON.parse(
      savedSession
    );

  } catch (error) {

    console.error(
      "Unable to read checkout session:",
      error
    );


    clearCheckoutSession();

    return null;

  }

}


// ================================================
// CREATE CHECKOUT SESSION
// ================================================

export function createCheckoutSession(
  orderDate
) {

  const session = {

    sessionId:
      crypto.randomUUID(),

    orderId:
      null,

    orderNumber:
      null,

    orderDate:
      orderDate || null,

    expiresAt:
      getCheckoutExpiry(
        orderDate
      ),

    createdAt:
      new Date().toISOString()

  };


  saveCheckoutSession(
    session
  );


  return session;

}


// ================================================
// SAVE CHECKOUT SESSION
// ================================================

export function saveCheckoutSession(
  session
) {

  localStorage.setItem(
    CHECKOUT_SESSION_KEY,
    JSON.stringify(
      session
    )
  );

}


// ================================================
// UPDATE CHECKOUT SESSION
// ================================================

export function updateCheckoutSession(
  updates
) {

  const session =
    getCheckoutSession();


  if (!session) {
    return null;
  }


  const updatedSession = {

    ...session,

    ...updates

  };


  saveCheckoutSession(
    updatedSession
  );


  return updatedSession;

}


// ================================================
// UPDATE SESSION ORDER DATE
// ================================================

export function updateCheckoutSessionOrderDate(
  orderDate
) {

  return updateCheckoutSession({

    orderDate,

    expiresAt:
      getCheckoutExpiry(
        orderDate
      )

  });

}


// ================================================
// CHECK SESSION EXPIRY
// ================================================

export function isCheckoutSessionExpired(
  session
) {

  if (
    !session ||
    !session.expiresAt
  ) {
    return true;
  }


  return (
    new Date() >=
    new Date(
      session.expiresAt
    )
  );

}


// ================================================
// CLEAR CHECKOUT SESSION
// ================================================

export function clearCheckoutSession() {

  localStorage.removeItem(
    CHECKOUT_SESSION_KEY
  );

}


// ================================================
// GET CHECKOUT EXPIRY
//
// Order cutoff:
// 8 PM the day before order date
// ================================================

function getCheckoutExpiry(
  orderDateValue
) {

  if (!orderDateValue) {
    return null;
  }


  const [
    year,
    month,
    day
  ] =
    orderDateValue
      .split("-")
      .map(Number);


  const orderDate =
    new Date(
      year,
      month - 1,
      day
    );


  const cutoff =
    new Date(
      orderDate
    );


  cutoff.setDate(
    cutoff.getDate() - 1
  );


  cutoff.setHours(
    20,
    0,
    0,
    0
  );


  return cutoff.toISOString();

}