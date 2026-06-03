const products = {
  salmon: {
    id: "salmon",
    name: "Salmon Deluxe",
    price: 12.90,
    image: "images/salmon-deluxe.jpg",

    description: "Mentaiko · Salmon · Crabstick · Japanese Rice",

    ingredients: [
      "Mentaiko",
      "Salmon",
      "Crabstick",
      "Japanese Rice"
    ],

    removable: [
      "Mentaiko",
      "Salmon",
      "Crabstick"
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        price: 0
      },
      {
        name: "Less Rice",
        price: 0
      },
      {
        name: "More Rice",
        price: 0
      }
    ],

    addons: [
      {
        name: "Extra Salmon",
        price: 2
      },
      {
        name: "Extra Crabstick",
        price: 1
      },
      {
        name: "Extra Mentaiko",
        price: 1.50
      }

    ]
  },

  shroom: {
    id: "shroom",
    name: "Shroom Bliss",
    price: 11.90,
    image: "images/shroom-bliss.jpg",

    description: "Shrooms · Corn · Cheese · Truffle · Japanese Rice",

    ingredients: [
      "Shrooms",
      "Corn",
      "Cheese",
      "Truffle",
      "Japanese Rice"
    ],

    removable: [
      "Corn",
      "Cheese",
      "Truffle"
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        price: 0
      },
      {
        name: "Less Rice",
        price: 0
      },
      {
        name: "More Rice",
        price: 0
      }
    ],

    addons: [
      {
        name: "Extra Corn",
        price: 0.50
      },
      {
        name: "Extra Shroom",
        price: 1
      },
      {
        name: "Extra Cheese",
        price: 1
      },
      {
        name: "Extra Truffle",
        price: 1.50
      }
    ]
  },

  chicken: {
    id: "chicken",
    name: "Chicken Comfort",
    price: 10.90,
    image: "images/chicken-comfort.jpg",

    description: "Mayo · Teriyaki · Chicken · Egg · Japanese Rice",

    ingredients: [
      "Mayo",
      "Teriyaki",
      "Chicken",
      "Egg",
      "Japanese Rice"
    ],

    removable: [
      "Mayo",
      "Chicken",
      "Egg"
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        price: 0
      },
      {
        name: "Less Rice",
        price: 0
      },
      {
        name: "More Rice",
        price: 0
      }
    ],

    addons: [
      {
        name: "Extra Chicken",
        price: 1
      },
      {
        name: "Extra Egg",
        price: 1
      },
      {
        name: "Extra Teriyaki",
        price: 0.50
      },
      {
        name: "Extra Mayo",
        price: 0.50
      }
    ]
  },

  tuna: {
    id: "tuna",
    name: "Tuna Delight",
    price: 9.90,
    image: "images/tuna-delight.jpg",

    description: "Mayo · Tuna · Cucumber · Japanese Rice",

    ingredients: [
      "Mayo",
      "Tuna",
      "Cucumber",
      "Japanese Rice"
    ],

    removable: [
      "Mayo",
      "Tuna",
      "Cucumber"
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        price: 0
      },
      {
        name: "Less Rice",
        price: 0
      },
      {
        name: "More Rice",
        price: 0
      }
    ],

    addons: [
      {
        name: "Extra Tuna",
        price: 1.50
      },
      {
        name: "Extra Cucumber",
        price: 0.50
      },
      {
        name: "Extra Mayo",
        price: 0.50
      },
    ]
  },

  luncheon: {
    id: "luncheon",
    name: "Luncheon Melt",
    price: 5.90,
    image: "images/luncheon-melt.jpg",

    description: "Mayo · Tuna · Cucumber · Japanese Rice",

    ingredients: [
      "Mayo",
      "Luncheon Meat",
      "Egg",
      "Japanese Rice"
    ],

    removable: [
      "Mayo",
      "Luncheon Meat",
      "Egg"
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        price: 0
      },
      {
        name: "Less Rice",
        price: 0
      },
      {
        name: "More Rice",
        price: 0
      }
    ],

    addons: [
      {
        name: "Extra Luncheon Meat",
        price: 1
      },
      {
        name: "Extra Egg",
        price: 0.5
      },
      {
        name: "Extra Mayo",
        price: 0.5
      },
    ]
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
    price: 1.0,
    image: "images/tea-bag.png",

    description: "Green tea bag",
  }
};