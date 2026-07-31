import {
  setupWheel,
  spinToPrize,
  isWheelSpinning
} from "./wheel.js";

import {
  checkSpin,
  claimSpin
} from "./sg61-lucky-draw.js";


document.addEventListener(
  "DOMContentLoaded",
  initialisePage
);


function initialisePage() {
  const wheelPrize =
    document.getElementById(
      "wheel-prize"
    );

  if (!wheelPrize) {
    console.error(
      "Wheel prize image was not found."
    );

    return;
  }

  setupWheel(
    wheelPrize
  );

  bindEvents();
}


function bindEvents() {
  document
    .getElementById(
      "check-spin-btn"
    )
    ?.addEventListener(
      "click",
      handleCheckSpin
    );

  document
    .getElementById(
      "spin-btn"
    )
    ?.addEventListener(
      "click",
      handleSpin
    );

  document
    .getElementById(
      "close-result-btn"
    )
    ?.addEventListener(
      "click",
      closeResultModal
    );

  document
    .getElementById(
      "spin-phone"
    )
    ?.addEventListener(
      "keydown",
      (
        event
      ) => {
        if (
          event.key ===
          "Enter"
        ) {
          handleCheckSpin();
        }
      }
    );
}


async function handleCheckSpin() {
  const input =
    document.getElementById(
      "spin-phone"
    );

  const button =
    document.getElementById(
      "check-spin-btn"
    );

  clearMessage();

  setButtonLoading({
    button,
    loading: true,
    loadingText:
      "Checking...",
    normalText:
      "Check Spin"
  });

  try {
    const result =
      await checkSpin(
        input?.value
      );

    if (!result.available) {
      hideSpinSection();

      showMessage(
        result.message,
        false
      );

      return;
    }

    updateSpinStatus(
      result
    );

    showSpinSection();

    showMessage(
      result.message,
      false
    );
  } catch (error) {
    hideSpinSection();

    showMessage(
      error.message,
      true
    );
  } finally {
    setButtonLoading({
      button,
      loading: false,
      loadingText:
        "Checking...",
      normalText:
        "Check Spin"
    });
  }
}

function setSpinButtonLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }

  button.disabled = loading;

  const image =
    button.querySelector("img");

  if (!image) {
    return;
  }

  image.style.opacity =
    loading ? "0.5" : "1";

  image.alt =
    loading
      ? "Spinning"
      : "";
}

async function handleSpin() {
  if (isWheelSpinning()) {
    return;
  }

  const button =
    document.getElementById(
      "spin-btn"
    );

  clearMessage();

  setSpinButtonLoading(
    button,
    true
  );

  try {
    const result =
      await claimSpin();

    await spinToPrize(
      result.prize.id
    );

    showResultModal(
      result
    );
  } catch (error) {
    showMessage(
      error.message,
      true
    );
  } finally {
    setSpinButtonLoading(
      button,
      false
    );
  }
}


function updateSpinStatus(
  result
) {
  const typeElement =
    document.getElementById(
      "spin-type-label"
    );

  const balanceElement =
    document.getElementById(
      "spin-balance"
    );

  const isBonus =
    result.spinType ===
    "bonus";

  if (typeElement) {
    typeElement.textContent =
      isBonus
        ? "Bonus Spin"
        : "Free Spin";
  }

  if (balanceElement) {
    balanceElement.textContent =
      isBonus
        ? "Your order unlocked 1 bonus spin!"
        : "You have 1 free spin available!";
  }
}


function showResultModal({
  prize,
  rewardCode
}) {
  const modal =
    document.getElementById(
      "result-modal"
    );

  const prizeElement =
    document.getElementById(
      "result-prize"
    );

  const codeElement =
    document.getElementById(
      "result-code"
    );

  if (prizeElement) {
    prizeElement.textContent =
      `${prize.emoji} ${prize.name}`;
  }

  if (codeElement) {
    codeElement.textContent =
      rewardCode;
  }

  modal?.classList.remove(
    "hidden"
  );
}


function closeResultModal() {
  document
    .getElementById(
      "result-modal"
    )
    ?.classList.add(
      "hidden"
    );

  hideSpinSection();

  const input =
    document.getElementById(
      "spin-phone"
    );

  if (input) {
    input.value = "";
  }

  clearMessage();
}


function showSpinSection() {
  document
    .getElementById(
      "spin-section"
    )
    ?.classList.remove(
      "hidden"
    );
}


function hideSpinSection() {
  document
    .getElementById(
      "spin-section"
    )
    ?.classList.add(
      "hidden"
    );
}


function showMessage(
  message,
  isError
) {
  const element =
    document.getElementById(
      "spin-message"
    );

  if (!element) {
    return;
  }

  element.textContent =
    message;

  element.classList.toggle(
    "is-error",
    isError
  );

  element.classList.toggle(
    "is-success",
    !isError
  );
}


function clearMessage() {
  const element =
    document.getElementById(
      "spin-message"
    );

  if (!element) {
    return;
  }

  element.textContent = "";

  element.classList.remove(
    "is-error",
    "is-success"
  );
}


function setButtonLoading({
  button,
  loading,
  loadingText,
  normalText
}) {
  if (!button) {
    return;
  }

  button.disabled =
    loading;

  button.textContent =
    loading
      ? loadingText
      : normalText;
}