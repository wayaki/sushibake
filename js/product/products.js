// ================================================
// Product data and configuration
// ================================================

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

  double_up: {
    id: "double_up",
    name: "Double-Up",
    price: 16.90,
    image: "../images/double-up.jpg",

    description:
      "Choose up to 2 flavours. Comes with 300g Japanese Rice or 200g Macaroni and 180g toppings.",

    flavourOptions: [
      { 
        productId: "tuna_delight", 
        extra: 0 
      },
      { 
        productId: "chicken_comfort", 
        extra: 1 
      },
      { 
        productId: "shroom_bliss", 
        extra: 2 
      },
      { 
        productId: "salmon_deluxe", 
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

  wayaki_trio: {
    id: "wayaki_trio",
    name: "Wayaki Trio",
    price: 31.90,
    originalPrice: 31.90,
    image: "../images/wayaki-trio.jpg",

    description:
      "Choose any 3 different flavours from Salmon Deluxe, Shroom Bliss, Chicken Comfort and Tuna Delight",

    flavourOptions: [
      {
        productId: "salmon_deluxe"
      },
      {
        productId: "shroom_bliss"
      },
      {
        productId: "chicken_comfort"
      },
      {
        productId: "tuna_delight"
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

  salmon_deluxe: {
    id: "salmon_deluxe",
    name: "Salmon Deluxe",
    price: 12.90,
    image: "../images/salmon-deluxe.jpg",

    description: "Mentaiko · Salmon · Crabstick · Cream Cheese",

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

  shroom_bliss: {
    id: "shroom_bliss",
    name: "Shroom Bliss",
    price: 11.90,
    image: "../images/shroom-bliss.jpg",

    description: "Shrooms · Corn · Cheese · Truffle · Cream Cheese",

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

  chicken_comfort: {
    id: "chicken_comfort",
    name: "Chicken Comfort",
    price: 10.90,
    image: "../images/chicken-comfort.jpg",

    description: "Mayo · Teriyaki · Chicken · Egg",

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

  tuna_delight: {
    id: "tuna_delight",
    name: "Tuna Delight",
    price: 9.90,
    image: "../images/tuna-delight.jpg",

    description: "Mayo · Tuna · Cucumber · Cream Cheese",

    removable: [
      "Cucumber",
      "Cream Cheese"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // FIERY TUNA
  // Spicy tuna and cucumber sushi bake
  // ========================

  fiery_tuna: {
    id: "fiery_tuna",
    name: "Fiery Tuna",
    price: 9.90,
    image: "../images/fiery-tuna.jpg",

    description: "Mayo · Tabasco · Chilli Flakes · Tuna · Cucumber · Cream Cheese",

    removable: [
      "Cucumber",
      "Cream Cheese"
    ],

    spicinessOptions: [
      "Level 1",
      "Level 2",
      "Level 3"
    ],

    baseOptions: DEFAULT_BASE_OPTIONS,

    portionOptions: DEFAULT_PORTION_OPTIONS,

    upgradeOptions: DEFAULT_UPGRADE_OPTIONS,

  },


  // ========================
  // UPGRADE SET
  // Edamame and Yuzu Jasmine Tea set
  // ========================

  upgrade_set: {
    id: "upgrade_set",
    name: "Upgrade to Set",
    price: 3.90,
    image: "../images/upgrade-set.jpg",

    description: "350ml Yuzu Jasmine Tea + 100g Edamame",
  },


  // ========================
  // SEAWEED
  // Individual roasted seaweed add-on
  // ========================

  seaweed_pack: {
    id: "seaweed_pack",
    name: "Seaweed",
    price: 1.0,
    image: "../images/seaweed.png",

    description: "Crispy roasted seaweed",
  },
  

  // ========================
  // TEA BAG
  // Individual green tea bag add-on
  // ========================

  green_tea_bag: {
    id: "green_tea_bag",
    name: "Green tea bag",
    price: 0.5,
    image: "../images/tea-bag.png",

    description: "Green tea bag",
  }
};

function isNineNinePromoActive() {
  const now = new Date();

  const sgTime =
    new Date(
      now.toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Singapore"
        }
      )
    );

  return (
    sgTime.getFullYear() === 2026 &&
    sgTime.getMonth() === 8 &&
    sgTime.getDate() === 9
  );
}


function getProductPrice(
  product
) {

  const promoProducts = [
    "salmon_deluxe",
    "shroom_bliss",
    "chicken_comfort",
    "tuna_delight",
    "fiery_tuna"
  ];


  if (
    isNineNinePromoActive() &&
    promoProducts.includes(
      product.id
    )
  ) {
    return 9.90;
  }


  return product.price;
}