import {
  FREE_PRIZES,
  BONUS_PRIZES
} from "./prizes.js";


const WHEEL_COLOURS = [
  "#FFD37A",
  "#F7A8A8",
  "#CDB9E8",
  "#9FCBE8",
  "#A8DDBB",
  "#D5E59B"
];


let canvas = null;
let context = null;

let currentPrizes = FREE_PRIZES;
let currentRotation = 0;
let isSpinning = false;


/*
 * Set up the wheel when the page loads.
 */
export function setupWheel(canvasElement) {
  if (!canvasElement) {
    throw new Error(
      "Prize wheel canvas was not found."
    );
  }

  canvas = canvasElement;
  context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas is not supported by this browser."
    );
  }

  drawWheel();
}


/*
 * Change between:
 * "free"
 * "bonus"
 */
export function setWheelType(type) {
  if (isSpinning) {
    return;
  }

  if (type === "bonus") {
    currentPrizes = BONUS_PRIZES;
  } else {
    currentPrizes = FREE_PRIZES;
  }

  drawWheel();
}


/*
 * Used by other files to check
 * whether the wheel is moving.
 */
export function getIsSpinning() {
  return isSpinning;
}


/*
 * Draw the complete wheel.
 */
function drawWheel() {
  if (!canvas || !context) {
    return;
  }

  const width = canvas.width;
  const height = canvas.height;

  const centreX = width / 2;
  const centreY = height / 2;

  const radius =
    Math.min(width, height) / 2 - 18;

  const sliceAngle =
    (Math.PI * 2) /
    currentPrizes.length;

  context.clearRect(
    0,
    0,
    width,
    height
  );

  currentPrizes.forEach(
    (prize, index) => {
      const startAngle =
        -Math.PI / 2 +
        index * sliceAngle;

      const endAngle =
        startAngle + sliceAngle;

      drawSlice({
        prize,
        index,
        startAngle,
        endAngle,
        sliceAngle,
        centreX,
        centreY,
        radius
      });
    }
  );

  drawOuterBorder({
    centreX,
    centreY,
    radius
  });

  drawCentreCircle({
    centreX,
    centreY
  });
}


/*
 * Draw one wheel slice.
 */
function drawSlice({
  prize,
  index,
  startAngle,
  endAngle,
  sliceAngle,
  centreX,
  centreY,
  radius
}) {
  context.beginPath();

  context.moveTo(
    centreX,
    centreY
  );

  context.arc(
    centreX,
    centreY,
    radius,
    startAngle,
    endAngle
  );

  context.closePath();

  context.fillStyle =
    WHEEL_COLOURS[
      index % WHEEL_COLOURS.length
    ];

  context.fill();

  context.strokeStyle = "#FFFFFF";
  context.lineWidth = 5;
  context.stroke();

  drawPrizeContent({
    prize,
    startAngle,
    sliceAngle,
    centreX,
    centreY,
    radius
  });
}


/*
 * Draw the emoji and prize name.
 */
function drawPrizeContent({
  prize,
  startAngle,
  sliceAngle,
  centreX,
  centreY,
  radius
}) {
  const middleAngle =
    startAngle + sliceAngle / 2;

  const contentDistance =
    radius * 0.66;

  const x =
    centreX +
    Math.cos(middleAngle) *
      contentDistance;

  const y =
    centreY +
    Math.sin(middleAngle) *
      contentDistance;

  context.save();

  context.translate(x, y);

  /*
   * Rotate text so it points outward.
   */
  context.rotate(
    middleAngle + Math.PI / 2
  );

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#3F210F";

  context.font =
    "32px Arial";

  context.fillText(
    prize.emoji,
    0,
    -24
  );

  context.font =
    "bold 16px Arial";

  const lines =
    getPrizeLabelLines(
      prize.name
    );

  lines.forEach(
    (line, index) => {
      context.fillText(
        line,
        0,
        14 + index * 19
      );
    }
  );

  context.restore();
}


/*
 * Split longer prize names
 * into two short lines.
 */
function getPrizeLabelLines(name) {
  const labels = {
    "Free Seaweed": [
      "FREE",
      "SEAWEED"
    ],

    "Free Drink": [
      "FREE",
      "DRINK"
    ],

    "Free Edamame": [
      "FREE",
      "EDAMAME"
    ],

    "$5 OFF": [
      "$5 OFF"
    ],

    "Free Delivery": [
      "FREE",
      "DELIVERY"
    ],

    "Free 1-Pax Tray": [
      "FREE 1-PAX",
      "TRAY"
    ]
  };

  return labels[name] || [name];
}


/*
 * Draw the red outer edge.
 */
function drawOuterBorder({
  centreX,
  centreY,
  radius
}) {
  context.beginPath();

  context.arc(
    centreX,
    centreY,
    radius,
    0,
    Math.PI * 2
  );

  context.strokeStyle = "#EF4035";
  context.lineWidth = 18;
  context.stroke();
}


/*
 * Draw the centre circle.
 *
 * You can remove this if your HTML
 * already has a spin button covering
 * the centre.
 */
function drawCentreCircle({
  centreX,
  centreY
}) {
  context.beginPath();

  context.arc(
    centreX,
    centreY,
    48,
    0,
    Math.PI * 2
  );

  context.fillStyle = "#EF4035";
  context.fill();

  context.strokeStyle = "#FFFFFF";
  context.lineWidth = 7;
  context.stroke();
}


/*
 * Find the wheel position
 * of the winning prize.
 */
function getPrizeIndex(prizeId) {
  return currentPrizes.findIndex(
    (prize) =>
      prize.id === prizeId
  );
}


/*
 * Calculate where the wheel must stop.
 *
 * The pointer is assumed to be
 * positioned at the top.
 */
function calculateLandingRotation(
  prizeIndex
) {
  const sliceDegrees =
    360 / currentPrizes.length;

  const sliceCentreDegrees =
    prizeIndex * sliceDegrees +
    sliceDegrees / 2;

  /*
   * Move the middle of the selected
   * slice to the top pointer.
   */
  const landingDegrees =
    360 - sliceCentreDegrees;

  /*
   * Add several complete turns
   * to make it feel exciting.
   */
  const fullTurns =
    6 + Math.floor(
      Math.random() * 3
    );

  return (
    fullTurns * 360 +
    landingDegrees
  );
}


/*
 * Spin the wheel to the prize ID
 * returned by Supabase.
 *
 * Example:
 * await spinToPrize("delivery");
 */
export function spinToPrize(prizeId) {
  return new Promise(
    (resolve, reject) => {
      if (!canvas) {
        reject(
          new Error(
            "The wheel has not been set up."
          )
        );

        return;
      }

      if (isSpinning) {
        reject(
          new Error(
            "The wheel is already spinning."
          )
        );

        return;
      }

      const prizeIndex =
        getPrizeIndex(prizeId);

      if (prizeIndex === -1) {
        reject(
          new Error(
            `Prize not found: ${prizeId}`
          )
        );

        return;
      }

      isSpinning = true;

      const targetRotation =
        calculateLandingRotation(
          prizeIndex
        );

      currentRotation +=
        targetRotation;

      canvas.style.transition =
        [
          "transform",
          "5s",
          "cubic-bezier(",
          "0.12, 0.68, 0.12, 1",
          ")"
        ].join(" ");

      canvas.style.transform =
        `rotate(${currentRotation}deg)`;

      window.setTimeout(
        () => {
          isSpinning = false;

          resolve(
            currentPrizes[
              prizeIndex
            ]
          );
        },
        5200
      );
    }
  );
}