import {
  supabase
} from "../supabase-config.js";

import {
  findPrizeById
} from "./prizes.js";


let verifiedPhone = "";

let availableSpinType = null;

let availableDeliveryDate = null;


export function normalisePhone(
  value
) {
  return String(value ?? "")
    .replace(/\D/g, "");
}


export function isValidPhone(
  phone
) {
  return /^[89]\d{7}$/.test(
    phone
  );
}


export function getSpinState() {
  return {
    phone:
      verifiedPhone,

    spinType:
      availableSpinType,

    deliveryDate:
      availableDeliveryDate
  };
}


export async function checkSpin(
  phone
) {
  const normalisedPhone =
    normalisePhone(
      phone
    );

  if (
    !isValidPhone(
      normalisedPhone
    )
  ) {
    throw new Error(
      "Please enter a valid 8-digit Singapore mobile number."
    );
  }

  const {
    data,
    error
  } =
    await supabase
      .functions
      .invoke(
        "sg61-spin",
        {
          body: {
            action: "check",
            phone:
              normalisedPhone
          }
        }
      );

  if (error) {
    throw await createFunctionError(
      error,
      "Unable to check your spin."
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.message ||
      "Unable to check your spin."
    );
  }

  verifiedPhone =
    normalisedPhone;

  if (!data.available) {
    availableSpinType =
      null;

    availableDeliveryDate =
      null;

    return data;
  }

  availableSpinType =
    data.spinType;

  availableDeliveryDate =
    data.deliveryDate ||
    null;

  return data;
}


export async function claimSpin() {
  if (!verifiedPhone) {
    throw new Error(
      "Please check your phone number first."
    );
  }

  if (!availableSpinType) {
    throw new Error(
      "You do not have an available spin."
    );
  }

  const {
    data,
    error
  } =
    await supabase
      .functions
      .invoke(
        "sg61-spin",
        {
          body: {
            action: "spin",

            phone:
              verifiedPhone,

            spinType:
              availableSpinType,

            deliveryDate:
              availableDeliveryDate
          }
        }
      );

  if (error) {
    throw await createFunctionError(
      error,
      "Unable to complete your spin."
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.message ||
      "This spin is no longer available."
    );
  }

  const prize =
    findPrizeById(
      data.prizeId
    );

  if (!prize) {
    throw new Error(
      "The server returned an unknown prize."
    );
  }

  availableSpinType =
    null;

  availableDeliveryDate =
    null;

  return {
    prize,
    rewardCode:
      data.rewardCode,

    spinType:
      data.spinType,

    deliveryDate:
      data.deliveryDate ||
      null
  };
}


async function createFunctionError(
  error,
  fallbackMessage
) {
  let message =
    error?.message ||
    fallbackMessage;

  if (error?.context) {
    try {
      const responseBody =
        await error
          .context
          .json();

      message =
        responseBody?.message ||
        responseBody?.error ||
        message;
    } catch {
      // Keep fallback message.
    }
  }

  return new Error(
    message
  );
}