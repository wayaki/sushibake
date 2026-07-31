import {
  PRIZES
} from "./prizes.js";


const WHEEL_COLOURS = [
  "#FFD47E",
  "#F7AAA4",
  "#CDB9E9",
  "#A6CFE8",
  "#AEE0BF",
  "#DCE99F"
];


let canvas = null;
let context = null;

let wheelElement = null;
let currentRotation = 0;
let spinning = false;


export function setupWheel(
  element
) {
  if (!element) {
    throw new Error(
      "Wheel image was not found."
    );
  }

  wheelElement = element;
}


export function isWheelSpinning() {
  return spinning;
}


function drawWheel() {
  const width =
    canvas.width;

  const height =
    canvas.height;

  const centreX =
    width / 2;

  const centreY =
    height / 2;

  const radius =
    Math.min(
      width,
      height
    ) / 2 - 22;

  const sliceAngle =
    Math.PI * 2 /
    PRIZES.length;

  context.clearRect(
    0,
    0,
    width,
    height
  );

  PRIZES.forEach(
    (
      prize,
      index
    ) => {
      const startAngle =
        -Math.PI / 2 +
        index * sliceAngle;

      const endAngle =
        startAngle +
        sliceAngle;

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
}


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
      index %
      WHEEL_COLOURS.length
    ];

  context.fill();

  context.strokeStyle =
    "#FFFFFF";

  context.lineWidth = 6;
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


function drawPrizeContent({
  prize,
  startAngle,
  sliceAngle,
  centreX,
  centreY,
  radius
}) {
  const middleAngle =
    startAngle +
    sliceAngle / 2;

  const distance =
    radius * 0.68;

  const x =
    centreX +
    Math.cos(middleAngle) *
    distance;

  const y =
    centreY +
    Math.sin(middleAngle) *
    distance;

  context.save();

  context.translate(
    x,
    y
  );

  context.rotate(
    middleAngle +
    Math.PI / 2
  );

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.fillStyle =
    "#3F210F";

  context.font =
    "38px Arial";

  context.fillText(
    prize.emoji,
    0,
    -28
  );

  context.font =
    "bold 19px Arial";

  const lines =
    prize.shortName
      .split("\n");

  lines.forEach(
    (
      line,
      index
    ) => {
      context.fillText(
        line,
        0,
        18 +
        index * 23
      );
    }
  );

  context.restore();
}


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

  context.strokeStyle =
    "#EF4035";

  context.lineWidth = 22;
  context.stroke();
}


function getPrizeIndex(
  prizeId
) {
  return PRIZES.findIndex(
    (prize) =>
      prize.id === prizeId
  );
}

function calculateLandingRotation(
  prizeIndex
) {
  const sliceDegrees =
    360 / PRIZES.length;

  const POINTER_OFFSET = 0;
  const LANDING_VARIATION = 3;

  const randomOffset =
    Math.random() *
      LANDING_VARIATION *
      2 -
    LANDING_VARIATION;

  /*
   * Absolute angle where the winning
   * prize should finish.
   */
  const targetAngle =
    (
      360 -
      prizeIndex * sliceDegrees +
      POINTER_OFFSET +
      randomOffset
    ) % 360;

  /*
   * Current visible angle of the wheel.
   */
  const currentAngle =
    (
      currentRotation % 360 +
      360
    ) % 360;

  /*
   * Amount needed to move clockwise
   * from the current angle to target.
   */
  const rotationToTarget =
    (
      targetAngle -
      currentAngle +
      360
    ) % 360;

  const fullTurns =
    6 +
    Math.floor(
      Math.random() * 3
    );

  return (
    fullTurns * 360 +
    rotationToTarget
  );
}

export function spinToPrize(
  prizeId
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (!wheelElement) {
        reject(
          new Error(
            "Wheel has not been set up."
          )
        );

        return;
      }

      if (spinning) {
        reject(
          new Error(
            "The wheel is already spinning."
          )
        );

        return;
      }

      const prizeIndex =
        getPrizeIndex(
          prizeId
        );

      if (prizeIndex === -1) {
        reject(
          new Error(
            `Unknown prize: ${prizeId}`
          )
        );

        return;
      }

      spinning = true;

      const targetRotation =
        calculateLandingRotation(
          prizeIndex
        );

      currentRotation +=
        targetRotation;

      wheelElement.style.transition =
        "transform 5s cubic-bezier(0.12, 0.68, 0.12, 1)";

      wheelElement.style.transform =
        `rotate(${currentRotation}deg)`;

      wheelElement.addEventListener(
        "transitionend",
        () => {
          spinning = false;
          resolve();
        },
        {
          once: true
        }
      );
    }
  );
}