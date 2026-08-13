// ================================================
// Product data and configuration
// ================================================

  // TEMPORARY 
const LIMITED_MENU = {
  startDate: "2026-08-17",
  endDate: "2026-08-31",

  products: [
    "salmon",
    "tuna"
  ],

  selfCollectionOnly: true
};

// ========================
// DEFAULT BASE OPTIONS
// Shared base choices for individual products
// ========================

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


// ========================
// DEFAULT PORTION OPTIONS
// Shared portion choices for individual products
// ========================

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


// ========================
// DEFAULT UPGRADE OPTIONS
// Shared set upgrade choices for individual products
// ========================

const DEFAULT_UPGRADE_OPTIONS = [
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


// ========================
// PRODUCT CATALOGUE
// Store all product details, prices and options
// ========================

const PRODUCTS  = {

  // ========================
  // DOUBLE-UP
  // Large tray with two selectable flavours
  // ========================

  doubleup: {
    id: "doubleup",
    name: "Double-Up",
    price: 16.90,
    image: "../images/double-up.jpg",

    description:
      "Choose up to 2 flavours. Comes with 300g Japanese Rice or 200g Macaroni and 180g toppings.",

    flavourOptions: [
      { 
        productId: "tuna", 
        extra: 0 
      },
      { 
        productId: "chicken", 
        extra: 1 
      },
      { 
        productId: "shroom", 
        extra: 2 
      },
      { 
        productId: "salmon", 
        extra: 3 
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
    ]
  },


  // ========================
  // WAYAKI TRIO
  // Bundle of three different individual trays
  // ========================

  trio: {
    id: "trio",
    name: "Wayaki Trio",
    price: 31.90,
    image: "../images/wayaki-trio.jpg",

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


  // ========================
  // SALMON DELUXE
  // Salmon, crabstick and mentaiko sushi bake
  // ========================

  salmon: {
    id: "salmon",
    name: "Salmon Deluxe",
    price: 12.90,
    image: "../images/salmon-deluxe.jpg",

    description: "Mentaiko · Salmon · Crabstick",

    ingredients: [
      "Mentaiko",
      "Salmon",
      "Crabstick",
    ],

    removable: [
      "Mentaiko",
      "Salmon",
      "Crabstick",
      "Cream Cheese"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // SHROOM BLISS
  // Mushroom, corn, cheese and truffle sushi bake
  // ========================

  shroom: {
    id: "shroom",
    name: "Shroom Bliss",
    price: 11.90,
    image: "../images/shroom-bliss.jpg",

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

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // CHICKEN COMFORT
  // Teriyaki chicken and egg sushi bake
  // ========================

  chicken: {
    id: "chicken",
    name: "Chicken Comfort",
    price: 10.90,
    image: "../images/chicken-comfort.jpg",

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

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // TUNA DELIGHT
  // Creamy tuna and cucumber sushi bake
  // ========================

  tuna: {
    id: "tuna",
    name: "Tuna Delight",
    price: 9.90,
    image: "../images/tuna-delight.jpg",

    description: "Mayo · Tuna · Cucumber",

    ingredients: [
      "Mayo",
      "Tuna",
      "Cucumber",
      "Cream Cheese"
    ],

    removable: [
      "Cucumber",
      "Cream Cheese"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // LUNCHEON MELT
  // Luncheon meat and egg sushi bake
  // ========================

  luncheon: {
    id: "luncheon",
    name: "Luncheon Melt",
    price: 5.90,
    image: "../images/luncheon-melt.jpg",

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

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // UPGRADE SET
  // Edamame and Yuzu Jasmine Tea set
  // ========================

  upgrade: {
    id: "upgrade",
    name: "Upgrade to Set",
    price: 3.90,
    image: "../images/upgrade-set.jpg",

    description: "350ml Yuzu Jasmine Tea + 100g Edamame",
  },


  // ========================
  // SEAWEED
  // Individual roasted seaweed add-on
  // ========================

  seaweed: {
    id: "seaweed",
    name: "Seaweed",
    price: 1.0,
    image: "../images/seaweed.png",

    description: "Crispy roasted seaweed",
  },
  

  // ========================
  // TEA BAG
  // Individual green tea bag add-on
  // ========================

  tea: {
    id: "tea",
    name: "Tea bag",
    price: 0.5,
    image: "../images/tea-bag.png",

    description: "Green tea bag",
  }
};