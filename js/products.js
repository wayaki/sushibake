const products = {
  trio: {
    id: "trio",
    name: "Wayaki Trio",
    price: 31.90,
    image: "images/wayaki-trio.jpg",

    description: "Choose any 3 different flavours from Salmon Deluxe, Shroom Bliss, Chicken comfort and Tuna Delight",

    flavourOptions: [
      { name: "Salmon Deluxe", price: 12.90 },
      { name: "Shroom Bliss", price: 11.90 },
      { name: "Chicken Comfort", price: 10.90 },
      { name: "Tuna Delight", price: 9.90 }
    ],

    riceOptions: [
      {
        name: "Normal Rice",
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],
    
    upgradeOptions: [
      { name: "No Upgrade", price: 0 },
      { name: "1 Set Upgrade", price: 3.90 },
      { name: "2 Set Upgrades", price: 7.80 },
      { name: "3 Set Upgrades", price: 11.70 }
    ]
  },

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
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],

    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
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
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],
    
    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
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
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],
      
    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
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
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],
        
    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
      }
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
        subtitle: "→ 180g",
        price: 0
      },
      {
        name: "Less Rice",
        subtitle: "→ 140g",
        price: 0
      },
      {
        name: "More Rice",
        subtitle: "→ 220g",
        price: 0
      }
    ],
        
    upgradeOptions: [
      {
        name: "No Upgrade",
        price: 0
      },
      {
        name: "Upgrade to Set",
        subtitle: "100g Edamame + 350ml Yuzu Jasmine Tea",
        price: 3.90
      }
    ]
  },

  upgrade: {
    id: "upgrade",
    name: "Upgrade to Set",
    price: 2.90,
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