export const PRIZES = [
  {
    id: "seaweed",
    name: "Free Seaweed",
    emoji: "🌿"
  },
  
  {
    id: "drink",
    name: "Free Drink",
    emoji: "🥤"
  },

  {
    id: "edamame",
    name: "Free Edamame",
    emoji: "🫛"
  },

  {
    id: "voucher",
    name: "$5 OFF",
    emoji: "💰"
  },

  {
    id: "delivery",
    name: "Free Delivery",
    emoji: "🚚"
  },

  {
    id: "tray",
    name: "Free 1-Pax Tray",
    emoji: "🍱"
  }
];

export function findPrizeById(prizeId) {
  return PRIZES.find(
    (prize) => prize.id === prizeId
  );
}