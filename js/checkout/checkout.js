// ================================================
// Checkout → Payment
// ================================================

import {
  createCheckoutSession,
  getCheckoutSession,
  updateCheckoutSession,
  updateCheckoutSessionOrderDate,
  isCheckoutSessionExpired,
  clearCheckoutSession,
} from "./checkout-session.js";


// ================================================
// SUPABASE ORDER
// ================================================

import {
  buildOrderPayload,
  createOrder,
  updatePendingOrder,
} from "../api/cart-api.js";


// ================================================
// INITIALISE CHECKOUT
// ================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const session =
      getCheckoutSession();


    // ========================
    // EXISTING RECEIPT
    //
    // If this checkout already
    // created an order and the
    // customer comes Back here,
    // return them to the receipt
    // instead of allowing another
    // submission.
    // ========================

    if (
      session?.orderNumber &&
      session?.receiptToken &&
      (
        session.status ===
          "receipt" ||
        session.status ===
          "whatsapp_opened"
      )
    ) {

      const receiptUrl =
        "./receipt.html" +
        "?order=" +
        encodeURIComponent(
          session.orderNumber
        ) +
        "&key=" +
        encodeURIComponent(
          session.receiptToken
        );


      window.location.replace(
        receiptUrl
      );

      return;
    }


    // ========================
    // NORMAL CHECKOUT
    // ========================

    toggleDelivery();

    populateOrderDates();

    restoreCheckoutDraft();

    updateTotal();


    console.log(
      "Checkout session:",
      session
    );
  }
);


// ================================================
// CONTINUE TO PAYMENT
// ================================================

async function goToPayment() {

  // ========================
  // GET FORM DATA
  // ========================

  const data =
    getFormData();


  // ========================
  // VALIDATE FORM
  // ========================

  const error =
    validateForm(
      data
    );


  if (error) {

    alert(
      error
    );

    return;
  }


  // ========================
  // PAYMENT METHOD
  // ========================

  const paymentMethod =
    document.querySelector(
      'input[name="payment-method"]:checked'
    )?.value;


  if (!paymentMethod) {

    alert(
      "Please select a payment method."
    );

    return;
  }


  // ========================
  // DELIVERY FEE
  // ========================

  const deliveryFee =
    data.method === "delivery"
      ? getDeliveryFee()
      : 0;


  // ========================
  // CHECKOUT DATA
  // ========================

  const checkoutData = {

    formData:
      data,

    cart,

    deliveryFee,

    subtotal:
      calculateSubtotal(),

    total:
      calculateTotal(),

    paymentMethod,
  };


  // ========================
  // SAVE CHECKOUT DRAFT
  // ========================

  localStorage.setItem(
    "wayakiCheckout",
    JSON.stringify(
      checkoutData
    )
  );


  // ========================
  // GET / CREATE SESSION
  // ========================

  let session =
    getCheckoutSession();


  if (
    !session ||
    isCheckoutSessionExpired(
      session
    )
  ) {

    clearCheckoutSession();


    session =
      createCheckoutSession(
        data.orderDateValue
      );
  }


  // ========================
  // UPDATE SESSION ORDER DATE
  // ========================

  if (
    session.orderDate !==
    data.orderDateValue
  ) {

    session =
      updateCheckoutSessionOrderDate(
        data.orderDateValue
      );
  }


  // ================================================
  // PAYNOW
  // ================================================

  if (
    paymentMethod ===
    "paynow"
  ) {

    window.location.href =
      "./paynow.html";

    return;
  }


  // ================================================
  // WHATSAPP
  // ================================================

  if (
    paymentMethod ===
    "whatsapp"
  ) {

    await handleWhatsAppCheckout(
      checkoutData,
      session
    );
  }
}


// ================================================
// WHATSAPP CHECKOUT
// ================================================

async function handleWhatsAppCheckout(
  checkoutData,
  session
) {

  const {
    formData,
    cart,
    deliveryFee,
  } =
    checkoutData;


  // ========================
  // BUILD SUPABASE PAYLOAD
  // ========================

  const payload =
    buildOrderPayload(
      formData,
      cart,
      deliveryFee
    );


  payload.payment_method =
    "whatsapp";


  // ========================
  // CHECKOUT TOKEN
  //
  // Links this browser
  // checkout session to
  // the Supabase order.
  // ========================

  payload.checkout_token =
    session.sessionId;


  // ========================
  // BUTTON LOADING STATE
  // ========================

  if (paymentButton) {

    paymentButton.disabled =
      true;

    paymentButton.textContent =
      "Preparing Order...";
  }


  try {

    // ========================
    // CREATE OR UPDATE ORDER
    // ========================

    let order;


    if (
      session.orderId
    ) {

      // Existing order:
      // keep the same WK number
      // and receipt token.

      console.log(
        "Updating existing WhatsApp order:",
        session.orderNumber
      );


      order =
        await updatePendingOrder(
          session.orderId,
          session.sessionId,
          payload
        );

    } else {

      // No order exists yet:
      // create a new WK order.

      console.log(
        "Creating new WhatsApp order"
      );


      order =
        await createOrder(
          payload
        );
    }


    console.log(
      "Prepared WhatsApp order:",
      order
    );


    // ========================
    // VALIDATE RESPONSE
    // ========================

    if (
      !order
        ?.created_order_id ||
      !order
        ?.created_order_number
    ) {

      throw new Error(
        "Order information was not returned."
      );
    }


    if (
      !order.receipt_token
    ) {

      throw new Error(
        "Receipt token was not returned."
      );
    }


    // ========================
    // ATTACH ORDER TO SESSION
    // ========================

    updateCheckoutSession({

      orderId:
        order.created_order_id,

      orderNumber:
        order.created_order_number,

      receiptToken:
        order.receipt_token,

      // Customer has reached the
      // receipt stage.
      status:
        "receipt",
    });


    // ========================
    // SAVE CREATED ORDER
    //
    // This is only a convenient
    // local snapshot.
    // The receipt page itself
    // will load its real data
    // from Supabase.
    // ========================

    localStorage.setItem(
      "wayakiCreatedOrder",
      JSON.stringify({

        orderId:
          order.created_order_id,

        orderNumber:
          order.created_order_number,

        receiptToken:
          order.receipt_token,

        customerTotal:
          Number(
            order.customer_total
          ),

        paymentMethod:
          "whatsapp",
      })
    );


    // ========================
    // BUILD RECEIPT URL
    // ========================

    const receiptUrl =
      "./receipt.html" +
      "?order=" +
      encodeURIComponent(
        order.created_order_number
      ) +
      "&key=" +
      encodeURIComponent(
        order.receipt_token
      );


    // ========================
    // GO TO RECEIPT
    //
    // WhatsApp is NOT opened
    // here anymore.
    //
    // The customer sees their
    // receipt first and can
    // continue to WhatsApp
    // from there.
    // ========================

    window.location.href =
      receiptUrl;

  } catch (error) {

    console.error(
      "WhatsApp order failed:",
      error
    );


    alert(
      "Unable to prepare your order. Please try again."
    );


    // ========================
    // RESTORE BUTTON
    // ========================

    if (paymentButton) {

      paymentButton.disabled =
        false;

      paymentButton.textContent =
        "Continue";
    }
  }
}


// ================================================
// CONTINUE BUTTON
// ================================================

const paymentButton =
  document.getElementById(
    "payment-btn"
  );


if (paymentButton) {

  paymentButton.addEventListener(
    "click",
    goToPayment
  );
}


// ================================================
// RESTORE CHECKOUT DRAFT
// ================================================

function restoreCheckoutDraft() {

  const savedCheckout =
    localStorage.getItem(
      "wayakiCheckout"
    );


  if (!savedCheckout) {
    return;
  }


  try {

    const checkoutData =
      JSON.parse(
        savedCheckout
      );


    const {
      formData,
      paymentMethod
    } =
      checkoutData;


    if (!formData) {
      return;
    }


    // ========================
    // CUSTOMER DETAILS
    // ========================

    document.getElementById(
      "name"
    ).value =
      formData.name || "";


    document.getElementById(
      "phone"
    ).value =
      formData.phone || "";


    // ========================
    // ORDER DATE
    // ========================

    const orderDateSelect =
      document.getElementById(
        "order-date"
      );


    if (
      formData.orderDateValue &&
      [
        ...orderDateSelect.options
      ].some(
        (option) =>
          option.value ===
          formData.orderDateValue
      )
    ) {

      orderDateSelect.value =
        formData.orderDateValue;
    }


    // ========================
    // PICKUP TIME
    // ========================

    const pickupTimeSelect =
      document.getElementById(
        "pickup-time"
      );


    if (
      formData.pickupTime &&
      [
        ...pickupTimeSelect.options
      ].some(
        (option) =>
          option.value ===
          formData.pickupTime
      )
    ) {

      pickupTimeSelect.value =
        formData.pickupTime;
    }


    // ========================
    // COLLECTION METHOD
    // ========================

    if (
      formData.method
    ) {

      const methodOption =
        document.querySelector(
          `input[name="method"][value="${formData.method}"]`
        );


      if (
        methodOption &&
        !methodOption.disabled
      ) {

        methodOption.checked =
          true;
      }
    }


    // ========================
    // DELIVERY DETAILS
    // ========================

    document.getElementById(
      "area"
    ).value =
      formData.area || "";


    document.getElementById(
      "address"
    ).value =
      formData.address || "";


    document.getElementById(
      "postal"
    ).value =
      formData.postal || "";


    document.getElementById(
      "unit"
    ).value =
      formData.unit || "";


    // ========================
    // PAYMENT METHOD
    // ========================

    if (
      paymentMethod
    ) {

      const paymentOption =
        document.querySelector(
          `input[name="payment-method"][value="${paymentMethod}"]`
        );


      if (
        paymentOption
      ) {

        paymentOption.checked =
          true;
      }
    }


    // ========================
    // REFRESH UI
    // ========================

    toggleDelivery();

    updateTotal();

  } catch (error) {

    console.error(
      "Unable to restore checkout draft:",
      error
    );
  }
}