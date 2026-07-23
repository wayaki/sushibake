const DEFAULT_BASE_OPTIONS = [
    {
        name: "Japanese Rice",
        subtitle: "180g",
        price: 0
    },
    {
        name: "Macaroni",
        subtitle: "150g",
        price: 0
    }
];

const DEFAULT_PORTION_OPTIONS = [
    {
        name: "Normal",
        price: 0
    },
    {
        name: "Less",
        price: 0
    },
    {
        name: "More",
        price: 0
    }
];

const DEFAULT_UPGRADE = [
    {
        name: "No Upgrade",
        price: 0
    },
    {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
    }
];

const DOUBLE_UP_FLAVOUR_PRICE = {
  tuna: 0,
  chicken: 1,
  shroom: 2,
  salmon: 3
};

const DOUBLE_UP_BASE_PRICE = 16.90;

const products = {
  doubleup: {
    id: "doubleup",
    name: "Double-Up",
    price: 16.90,
    image: "images/double-up.jpg",

    description:
      "Choose up to 2 flavours. Comes with 300g Japanese Rice or 200g Macaroni and 180g toppings.",

    flavourOptions: [
      {
        productId: "tuna"
      },
      {
        productId: "chicken"
      },
      {
        productId: "shroom"
      },
      {
        productId: "salmon"
      }
    ],

    baseOptions: [
      {
        name: "Japanese Rice",
        subtitle: "300g",
        price: 0
      },
      {
        name: "Macaroni",
        subtitle: "200g",
        price: 0
      }
    ],

    upgradeOptions: DEFAULT_UPGRADE
  },

  trio: {
    id: "trio",
    name: "Wayaki Trio",
    price: 31.90,
    image: "images/wayaki-trio.jpg",

    description:
      "Choose any 3 different flavours from Salmon Deluxe, Shroom Bliss, Chicken Comfort and Tuna Delight",

    flavourOptions: [
      {
        productId: "salmon"
      },
      {
        productId: "shroom"
      },
      {
        productId: "chicken"
      },
      {
        productId: "tuna"
      }
    ],

    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "1 Set Upgrade",
        price: 3.90
      },
      {
        name: "2 Set Upgrades",
        price: 7.80
      },
      {
        name: "3 Set Upgrades",
        price: 11.70
      }
    ]
  },

  salmon: {
    id: "salmon",
    name: "Salmon Deluxe",
    price: 12.90,
    image: "images/salmon-deluxe.jpg",

    description: "Mentaiko · Salmon · Crabstick",

    ingredients: [
      "Mentaiko",
      "Salmon",
      "Crabstick",
    ],

    removable: [
      "Mentaiko",
      "Salmon",
      "Crabstick"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE,

  },

  shroom: {
    id: "shroom",
    name: "Shroom Bliss",
    price: 11.90,
    image: "images/shroom-bliss.jpg",

    description: "Shrooms · Corn · Cheese · Truffle",

    ingredients: [
      "Shrooms",
      "Corn",
      "Cheese",
      "Truffle",
    ],

    removable: [
      "Corn",
      "Cheese",
      "Truffle"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE,

  },

  chicken: {
    id: "chicken",
    name: "Chicken Comfort",
    price: 10.90,
    image: "images/chicken-comfort.jpg",

    description: "Mayo · Teriyaki · Chicken · Egg",

    ingredients: [
      "Mayo",
      "Teriyaki",
      "Chicken",
      "Egg",
    ],

    removable: [
      "Mayo",
      "Chicken",
      "Egg"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE,

  },

  tuna: {
    id: "tuna",
    name: "Tuna Delight",
    price: 9.90,
    image: "images/tuna-delight.jpg",

    description: "Mayo · Tuna · Cucumber",

    ingredients: [
      "Mayo",
      "Tuna",
      "Cucumber",
    ],

    removable: [
      "Mayo",
      "Tuna",
      "Cucumber"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE,

  },

  luncheon: {
    id: "luncheon",
    name: "Luncheon Melt",
    price: 5.90,
    image: "images/luncheon-melt.jpg",

    description: "Mayo · Luncheon Meat · Egg",

    ingredients: [
      "Mayo",
      "Luncheon Meat",
      "Egg",
    ],

    removable: [
      "Mayo",
      "Luncheon Meat",
      "Egg"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE,

  },

  upgrade: {
    id: "upgrade",
    name: "Upgrade to Set",
    price: 3.90,
    image: "images/upgrade-set.jpg",

    description: "350ml Yuzu Jasmine Tea + 100g Edamame",
  },

  seaweed: {
    id: "seaweed",
    name: "Seaweed",
    price: 1.0,
    image: "images/seaweed.png",

    description: "Crispy roasted seaweed",
  },
  
  tea: {
    id: "tea",
    name: "Tea bag",
    price: 0.5,
    image: "images/tea-bag.png",

    description: "Green tea bag",
  }
};