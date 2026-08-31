// ================================================
// WAYAKI PAYNOW PAGE
// ================================================


// ================================================
// SUPABASE CLIENT
// ================================================

import {
  supabase
} from "../supabase-config.js";


import {
  buildOrderPayload,
  createOrder,
  updatePendingOrder,
} from "../api/cart-api.js";


import {
  getCheckoutSession,
  updateCheckoutSession,
  isCheckoutSessionExpired,
} from "./checkout-session.js";


// ================================================
// PAYNOW SETTINGS
// ================================================

const PAYNOW_MOBILE =
  "+6596180504";


// ================================================
// GET CHECKOUT DATA
// ================================================

const checkoutData =
  JSON.parse(
    localStorage.getItem(
      "wayakiCheckout"
    )
  );


// Customer must complete
// checkout first.

if (
  !checkoutData ||
  checkoutData.paymentMethod !==
    "paynow"
) {

  alert(
    "PayNow checkout information was not found."
  );

  window.location.href =
    "./checkout.html";

  throw new Error(
    "Missing PayNow checkout data"
  );
}


// ================================================
// GET CHECKOUT SESSION
// ================================================

const checkoutSession =
  getCheckoutSession();


if (
  !checkoutSession ||
  isCheckoutSessionExpired(
    checkoutSession
  )
) {

  alert(
    "Your checkout session has expired. Please return to checkout."
  );

  window.location.href =
    "./checkout.html";

  throw new Error(
    "Missing or expired checkout session"
  );
}


const {
  formData,
  cart,
  deliveryFee,
  total
} =
  checkoutData;


// ================================================
// PAGE ELEMENTS
// ================================================

const paymentOrderNumber =
  document.getElementById(
    "payment-order-number"
  );


const paymentTotal =
  document.getElementById(
    "payment-total"
  );


const paynowAmount =
  document.getElementById(
    "paynow-amount"
  );


const paynowReference =
  document.getElementById(
    "paynow-reference"
  );


const generatePayNowButton =
  document.getElementById(
    "generate-paynow-btn"
  );


const paynowGenerated =
  document.getElementById(
    "paynow-generated"
  );


const paynowQr =
  document.getElementById(
    "paynow-qr"
  );


// ================================================
// SCREENSHOT ELEMENTS
// ================================================

const paymentProof =
  document.getElementById(
    "payment-proof"
  );


const proofFileInfo =
  document.getElementById(
    "proof-file-info"
  );


const proofFileName =
  document.getElementById(
    "proof-file-name"
  );


const proofPreviewWrapper =
  document.getElementById(
    "proof-preview-wrapper"
  );


const proofPreview =
  document.getElementById(
    "proof-preview"
  );


const sendReceiptButton =
  document.getElementById(
    "send-receipt-btn"
  );


// ================================================
// PAGE STATE
// ================================================

let createdOrder =
  null;


let paymentProofFile =
  null;


let qrGenerated =
  false;


// ================================================
// SHOW CHECKOUT TOTAL
// ================================================

paymentTotal.textContent =
  `$${Number(
    total
  ).toFixed(2)}`;


paynowAmount.textContent =
  `$${Number(
    total
  ).toFixed(2)}`;


// ================================================
// INITIALISE PAYNOW PAGE
// ================================================

async function initialisePayNowPage() {

  paymentOrderNumber.textContent =
    "Generating...";


  // ========================
  // BUILD ORDER PAYLOAD
  // ========================

  const payload =
    buildOrderPayload(
      formData,
      cart,
      deliveryFee
    );


  payload.payment_method =
    "paynow";


  payload.checkout_token =
    checkoutSession.sessionId;


  console.log(
    "Preparing PayNow order:",
    payload
  );


  try {

    // ========================
    // CREATE OR UPDATE ORDER
    // ========================

    if (
      checkoutSession.orderId
    ) {

      console.log(
        "Updating existing PayNow order:",
        checkoutSession.orderNumber
      );


      createdOrder =
        await updatePendingOrder(
          checkoutSession.orderId,
          checkoutSession.sessionId,
          payload
        );

    } else {

      console.log(
        "Creating new PayNow order"
      );


      createdOrder =
        await createOrder(
          payload
        );
    }


    console.log(
      "PayNow order prepared:",
      createdOrder
    );


    // ========================
    // VALIDATE RESPONSE
    // ========================

    if (
      !createdOrder
        ?.created_order_id ||
      !createdOrder
        ?.created_order_number
    ) {

      throw new Error(
        "Order information was not returned."
      );
    }


    if (
      !createdOrder
        .receipt_token
    ) {

      throw new Error(
        "Receipt token was not returned."
      );
    }


    // ========================
    // ATTACH ORDER TO SESSION
    //
    // Do NOT set status:
    // "receipt" yet.
    //
    // Customer still needs to
    // pay + upload screenshot.
    // ========================

    updateCheckoutSession({

      orderId:
        createdOrder
          .created_order_id,

      orderNumber:
        createdOrder
          .created_order_number,

      receiptToken:
        createdOrder
          .receipt_token,

      status:
        "paynow",
    });


    const orderNumber =
      createdOrder
        .created_order_number;


    const orderTotal =
      Number(
        createdOrder
          .customer_total
      );


    // ========================
    // UPDATE PAGE
    // ========================

    paymentOrderNumber.textContent =
      orderNumber;


    paymentTotal.textContent =
      `$${orderTotal.toFixed(2)}`;


    paynowAmount.textContent =
      `$${orderTotal.toFixed(2)}`;


    paynowReference.textContent =
      orderNumber;


    // QR can now be generated.

    generatePayNowButton.disabled =
      false;


  } catch (error) {

    console.error(
      "PayNow order creation failed:",
      error
    );


    paymentOrderNumber.textContent =
      "Unable to generate";


    alert(
      "Unable to create your order. Please try again."
    );
  }
}


// ================================================
// GENERATE PAYNOW QR
// ================================================

generatePayNowButton.addEventListener(
  "click",
  generatePayNowQr
);


async function generatePayNowQr() {

  if (!createdOrder) {

    alert(
      "Your order is not ready yet."
    );

    return;
  }


  if (qrGenerated) {

    paynowGenerated.style.display =
      "block";

    return;
  }


  generatePayNowButton.disabled =
    true;


  generatePayNowButton.textContent =
    "Generating QR...";


  const orderNumber =
    createdOrder
      .created_order_number;


  const orderTotal =
    Number(
      createdOrder
        .customer_total
    );


  // ========================
  // BUILD PAYNOW PAYLOAD
  // ========================

  const paynowPayload =
    generatePayNowPayload({

      mobile:
        PAYNOW_MOBILE,

      amount:
        orderTotal,

      reference:
        orderNumber,
    });


  console.log(
    "PayNow payload:",
    paynowPayload
  );


  // ========================
  // DRAW QR CODE
  // ========================

  try {

    await QRCode.toCanvas(
      paynowQr,
      paynowPayload,
      {
        width:
          260,

        margin:
          2,
      }
    );


    // ========================
    // SHOW PAYMENT SECTION
    // ========================

    paynowGenerated.style.display =
      "block";


    qrGenerated =
      true;


    generatePayNowButton.style.display =
      "none";


  } catch (error) {

    console.error(
      "QR generation failed:",
      error
    );


    alert(
      "Unable to generate PayNow QR."
    );


    generatePayNowButton.disabled =
      false;


    generatePayNowButton.textContent =
      "Generate PayNow QR";
  }
}


// ================================================
// GENERATE PAYNOW / SGQR PAYLOAD
// ================================================

function generatePayNowPayload({
  mobile,
  amount,
  reference
}) {

  // ========================
  // PAYNOW ACCOUNT TEMPLATE
  // ========================

  const merchantAccount =

    buildTlv(
      "00",
      "SG.PAYNOW"
    ) +

    // 0 = Mobile Number

    buildTlv(
      "01",
      "0"
    ) +

    buildTlv(
      "02",
      mobile
    ) +

    // 0 = Amount cannot be edited

    buildTlv(
      "03",
      "0"
    );


  // ========================
  // ADDITIONAL DATA
  // ========================

  const additionalData =
    buildTlv(
      "01",
      reference
    );


  // ========================
  // MAIN SGQR PAYLOAD
  // ========================

  let payload =

    buildTlv(
      "00",
      "01"
    ) +

    buildTlv(
      "01",
      "12"
    ) +

    buildTlv(
      "26",
      merchantAccount
    ) +

    buildTlv(
      "52",
      "0000"
    ) +

    buildTlv(
      "53",
      "702"
    ) +

    buildTlv(
      "54",
      Number(
        amount
      ).toFixed(2)
    ) +

    buildTlv(
      "58",
      "SG"
    ) +

    buildTlv(
      "59",
      "WAYAKI"
    ) +

    buildTlv(
      "60",
      "Singapore"
    ) +

    buildTlv(
      "62",
      additionalData
    );


  // ========================
  // CRC FIELD HEADER
  // ========================

  payload +=
    "6304";


  // ========================
  // CHECKSUM
  // ========================

  const checksum =
    crc16(
      payload
    );


  return (
    payload +
    checksum
  );
}


// ================================================
// BUILD TLV FIELD
// Tag + Length + Value
// ================================================

function buildTlv(
  id,
  value
) {

  const text =
    String(
      value
    );


  return (
    id +
    String(
      text.length
    ).padStart(
      2,
      "0"
    ) +
    text
  );
}


// ================================================
// CRC16 CCITT
// Required by EMV QR payload
// ================================================

function crc16(
  text
) {

  let crc =
    0xffff;


  for (
    let i = 0;
    i < text.length;
    i++
  ) {

    crc ^=
      text.charCodeAt(
        i
      ) << 8;


    for (
      let bit = 0;
      bit < 8;
      bit++
    ) {

      if (
        crc &
        0x8000
      ) {

        crc =
          (crc << 1) ^
          0x1021;

      } else {

        crc =
          crc << 1;
      }


      crc &=
        0xffff;
    }
  }


  return crc
    .toString(16)
    .toUpperCase()
    .padStart(
      4,
      "0"
    );
}


// ================================================
// SCREENSHOT UPLOAD
// ================================================

paymentProof.addEventListener(
  "change",
  handlePaymentProof
);


function handlePaymentProof(
  event
) {

  const file =
    event.target.files?.[0];


  if (!file) {

    resetPaymentProof();

    return;
  }


  // ========================
  // IMAGE ONLY
  // ========================

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    alert(
      "Please upload an image."
    );


    paymentProof.value =
      "";


    resetPaymentProof();

    return;
  }


  // ========================
  // MAX 10 MB
  // ========================

  const maxSize =
    10 *
    1024 *
    1024;


  if (
    file.size >
    maxSize
  ) {

    alert(
      "Please upload an image below 10 MB."
    );


    paymentProof.value =
      "";


    resetPaymentProof();

    return;
  }


  paymentProofFile =
    file;


  // ========================
  // FILE NAME
  // ========================

  proofFileName.textContent =
    file.name;


  proofFileInfo.style.display =
    "flex";


  // ========================
  // PREVIEW
  // ========================

  const reader =
    new FileReader();


  reader.onload =
    function (
      event
    ) {

      proofPreview.src =
        event.target.result;


      proofPreviewWrapper
        .style.display =
          "block";
    };


  reader.readAsDataURL(
    file
  );


  // ========================
  // ENABLE CONTINUE
  // ========================

  sendReceiptButton.disabled =
    false;
}


// ================================================
// RESET PAYMENT PROOF
// ================================================

function resetPaymentProof() {

  paymentProofFile =
    null;


  proofFileInfo.style.display =
    "none";


  proofPreviewWrapper.style.display =
    "none";


  proofPreview.src =
    "";


  sendReceiptButton.disabled =
    true;
}


// ================================================
// UPLOAD PAYMENT PROOF
// ================================================

async function uploadPaymentProof() {

  if (!createdOrder) {

    throw new Error(
      "Order information is missing."
    );
  }


  if (!paymentProofFile) {

    throw new Error(
      "Payment screenshot is missing."
    );
  }


  const orderNumber =
    createdOrder
      .created_order_number;


  // ========================
  // GET FILE EXTENSION
  // ========================

  const extension =
    paymentProofFile
      .name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";


  // ========================
  // STORAGE PATH
  // ========================

  const filePath =
    `${orderNumber}/` +
    `proof-${Date.now()}.${extension}`;


  // ========================
  // UPLOAD TO STORAGE
  // ========================

  const {
    error:
      uploadError
  } =
    await supabase.storage
      .from(
        "payment-proofs"
      )
      .upload(
        filePath,
        paymentProofFile,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );


  if (
    uploadError
  ) {

    console.error(
      "Payment proof upload failed:",
      uploadError
    );

    throw uploadError;
  }


  console.log(
    "Payment proof uploaded:",
    filePath
  );


  // ========================
  // SAVE PATH TO ORDER
  // ========================

  const {
    error:
      updateError
  } =
    await supabase
      .from(
        "orders"
      )
      .update({
        payment_proof_path:
          filePath,
      })
      .eq(
        "id",
        createdOrder
          .created_order_id
      );


  if (
    updateError
  ) {

    console.error(
      "Unable to save payment proof path:",
      updateError
    );

    throw updateError;
  }


  console.log(
    "Payment proof path saved:",
    filePath
  );


  return filePath;
}


// ================================================
// CONTINUE TO RECEIPT
// ================================================

sendReceiptButton.addEventListener(
  "click",
  continueToReceipt
);


async function continueToReceipt() {

  // ========================
  // VALIDATION
  // ========================

  if (!createdOrder) {

    alert(
      "Order information is missing."
    );

    return;
  }


  if (!qrGenerated) {

    alert(
      "Please generate your PayNow QR first."
    );

    return;
  }


  if (!paymentProofFile) {

    alert(
      "Please upload your payment screenshot."
    );

    return;
  }


  // ========================
  // BUTTON LOADING STATE
  // ========================

  sendReceiptButton.disabled =
    true;


  sendReceiptButton.textContent =
    "Uploading Receipt...";


  try {

    // ========================
    // UPLOAD SCREENSHOT
    // ========================

    const proofPath =
      await uploadPaymentProof();


    console.log(
      "Saved payment proof:",
      proofPath
    );


    // ========================
    // UPDATE SESSION
    //
    // Payment proof is now
    // uploaded and customer
    // can go to receipt.
    // ========================

    updateCheckoutSession({

      orderId:
        createdOrder
          .created_order_id,

      orderNumber:
        createdOrder
          .created_order_number,

      receiptToken:
        createdOrder
          .receipt_token,

      status:
        "receipt",
    });


    // ========================
    // SAVE LOCAL SNAPSHOT
    // ========================

    localStorage.setItem(
      "wayakiCreatedOrder",
      JSON.stringify({

        orderId:
          createdOrder
            .created_order_id,

        orderNumber:
          createdOrder
            .created_order_number,

        receiptToken:
          createdOrder
            .receipt_token,

        customerTotal:
          Number(
            createdOrder
              .customer_total
          ),

        paymentMethod:
          "paynow",

        paymentProofPath:
          proofPath,
      })
    );


    // ========================
    // BUILD RECEIPT URL
    // ========================

    const receiptUrl =
      "./receipt.html" +
      "?order=" +
      encodeURIComponent(
        createdOrder
          .created_order_number
      ) +
      "&key=" +
      encodeURIComponent(
        createdOrder
          .receipt_token
      );


    // ========================
    // GO TO RECEIPT
    // ========================

    window.location.href =
      receiptUrl;


  } catch (error) {

    console.error(
      "Payment receipt upload failed:",
      error
    );


    alert(
      "Unable to upload your payment screenshot. Please try again."
    );


    sendReceiptButton.disabled =
      false;


    sendReceiptButton.textContent =
      "Continue to Receipt";
  }
}


// ================================================
// START PAYNOW PAGE
// ================================================

initialisePayNowPage();