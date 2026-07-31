export const PRIZES = [

  {
    id: "voucher",
    name: "$5 OFF",
    shortName: "$5 OFF",
    emoji: "💰"
  },

  {
    id: "seaweed",
    name: "Free Seaweed",
    shortName: "FREE\nSEAWEED",
    emoji: "🌿"
  },

  {
    id: "drink",
    name: "Free Drink",
    shortName: "FREE\nDRINK",
    emoji: "🥤"
  },

  {
    id: "tray",
    name: "Free 1-Pax Tray",
    shortName: "FREE 1-PAX\nTRAY",
    emoji: "🍱"
  },

  {
    id: "delivery",
    name: "Free Delivery",
    shortName: "FREE\nDELIVERY",
    emoji: "🚚"
  },

  {
    id: "edamame",
    name: "Free Edamame",
    shortName: "FREE\nEDAMAME",
    emoji: "🫛"
  }
];


export function findPrizeById(
  prizeId
) {
  return PRIZES.find(
    (prize) =>
      prize.id === prizeId
  ) || null;
}