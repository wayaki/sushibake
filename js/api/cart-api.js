// ================================================
// CART API
// Convert cart data and create orders in Supabase
// ================================================

import {
  supabase
} from "../supabase-config.js";


// ================================================
// PRODUCT CODE MAP
// Frontend product IDs / names → database codes
// ================================================

const PRODUCT_CODE_MAP = {
  salmon: "salmon_deluxe",
  salmon_deluxe: "salmon_deluxe",

  shroom: "shroom_bliss",
  shroom_bliss: "shroom_bliss",

  chicken: "chicken_comfort",
  chicken_comfort: "chicken_comfort",

  tuna: "tuna_delight",
  tuna_delight: "tuna_delight",

  luncheon: "luncheon_melt",
  luncheon_melt: "luncheon_melt",

  doubleup: "double_up",
  double_up: "double_up",

  trio: "wayaki_trio",
  wayaki_trio: "wayaki_trio",

  upgrade: "upgrade_set",
  upgrade_set: "upgrade_set",

  seaweed: "seaweed_pack",
  seaweed_pack: "seaweed_pack",

  tea: "yuzu_jasmine_tea",
  yuzu_jasmine_tea: "yuzu_jasmine_tea"
};


// ================================================
// PRODUCT NAME MAP
// Used when Trio / Double-Up stores display names
// ================================================

const PRODUCT_NAME_MAP = {
  "Salmon Deluxe": "salmon_deluxe",
  "Shroom Bliss": "shroom_bliss",
  "Chicken Comfort": "chicken_comfort",
  "Tuna Delight": "tuna_delight",
  "Luncheon Melt": "luncheon_melt"
};


const BASE_CODE_MAP = {
  "Japanese Rice": "rice",
  "Rice": "rice",
  "Macaroni": "macaroni"
};

const PORTION_CODE_MAP = {
  "Normal": "normal",
  "Less": "less",
  "More": "more"
};

const INGREDIENT_CODE_MAP = {
  "Mentaiko": "mentaiko",
  "Salmon": "salmon",
  "Crabstick": "crabstick",
  "Corn": "corn",
  "Cheese": "cheese",
  "Truffle": "truffle",
  "Mayo": "mayo",
  "Chicken": "chicken",
  "Egg": "egg",
  "Tuna": "tuna",
  "Cucumber": "cucumber",
  "Cream Cheese": "cream_cheese",
  "Luncheon Meat": "luncheon_meat"
};

// ================================================
// NORMALIZE PRODUCT CODE
// ================================================

function getProductCode(value) {
  if (!value) {
    return "";
  }

  return (
    PRODUCT_CODE_MAP[value] ||
    PRODUCT_NAME_MAP[value] ||
    value
  );
}

function getBaseCode(value) {
  return BASE_CODE_MAP[value] || value;
}

function getPortionCode(value) {
  return PORTION_CODE_MAP[value] || value;
}

function getIngredientCode(value) {
  return INGREDIENT_CODE_MAP[value] || value;
}

// ================================================
// NORMALIZE FLAVOUR
// Supports strings OR objects from Double-Up
// ================================================

function getFlavourCode(flavour) {
  if (!flavour) {
    return "";
  }

  // Example:
  // "Salmon Deluxe"

  if (typeof flavour === "string") {
    return getProductCode(flavour);
  }

  // Example:
  // {
  //   id: "salmon",
  //   name: "Salmon Deluxe"
  // }

  return getProductCode(
    flavour.id ||
    flavour.code ||
    flavour.name
  );
}


// ================================================
// GET UPGRADE QUANTITY
//
// Current cart stores upgradePrice.
// Example:
// $3.90  → 1 set
// $7.80  → 2 sets
// $11.70 → 3 sets
// ================================================

function getUpgradeQuantity(item) {
  if (
    !item.upgrade ||
    item.upgrade === "No Upgrade"
  ) {
    return 0;
  }

  const upgradePrice =
    Number(item.upgradePrice) || 0;

  if (upgradePrice <= 0) {
    return 0;
  }

  return Math.max(
    1,
    Math.round(upgradePrice / 3.90)
  );
}


// ================================================
// BUILD NORMAL PRODUCT SELECTIONS
// ================================================

function buildNormalSelections(item) {
  const selections = [];

  if (item.base) {
    selections.push({
      selection_type: "base",
      selection_value:
        getBaseCode(item.base)
    });
  }

  if (item.portion) {
    selections.push({
      selection_type: "portion",
      selection_value:
        getPortionCode(item.portion)
    });
  }

  if (
    Array.isArray(item.removed)
  ) {
    item.removed.forEach((ingredient) => {
      selections.push({
        selection_type: "removed",
        selection_value:
          getIngredientCode(ingredient)
      });
    });
  }

  return selections;
}


// ================================================
// BUILD DOUBLE-UP SELECTIONS
// ================================================

function buildDoubleUpSelections(item) {
  const selections = [];

  if (Array.isArray(item.flavours)) {
    item.flavours.forEach(
      (flavour, index) => {
        const group = index + 1;

        const flavourCode =
          getFlavourCode(flavour);

        if (!flavourCode) {
          return;
        }

        // Flavour
        selections.push({
          selection_group: group,
          selection_type: "flavour",
          selection_value: flavourCode
        });

        // Removed ingredients for this half
        if (
          Array.isArray(flavour.removed)
        ) {
          flavour.removed.forEach(
            (ingredient) => {
              selections.push({
                selection_group: group,
                selection_type: "removed",
                selection_value:
                  getIngredientCode(
                    ingredient
                  )
              });
            }
          );
        }
      }
    );
  }

  // Base applies to whole Double-Up
  if (item.base) {
    selections.push({
      selection_type: "base",
      selection_value:
        getBaseCode(item.base)
    });
  }

  return selections;
}

// ================================================
// BUILD TRIO SELECTIONS
// ================================================

function buildTrioSelections(item) {
  const selections = [];

  if (
    !Array.isArray(item.trays)
  ) {
    return selections;
  }

  item.trays.forEach(
    (tray, index) => {

      const group =
        Number(tray.trayNumber) ||
        index + 1;

      const flavourCode =
        getFlavourCode(
          tray.flavour
        );

      if (flavourCode) {
        selections.push({
          selection_group: group,
          selection_type: "flavour",
          selection_value: flavourCode
        });
      }

      if (tray.base) {
        selections.push({
          selection_group: group,
          selection_type: "base",
          selection_value:
            getBaseCode(tray.base)
        });
      }

      if (tray.portion) {
        selections.push({
          selection_group: group,
          selection_type: "portion",
          selection_value:
            getPortionCode(tray.portion)
        });
      }

      if (
        Array.isArray(tray.removed)
      ) {
        tray.removed.forEach(
          (ingredient) => {
            selections.push({
              selection_group: group,
              selection_type: "removed",
              selection_value:
                getIngredientCode(ingredient)
            });
          }
        );
      }
    }
  );

  return selections;
}


// ================================================
// ADD UPGRADE SELECTION
// ================================================

function addUpgradeSelection(
  selections,
  item
) {
  const upgradeQty =
    getUpgradeQuantity(item);

  if (upgradeQty <= 0) {
    return;
  }

  selections.push({
    selection_type: "upgrade",
    selection_value: "upgrade_set",
    quantity: upgradeQty
  });
}


// ================================================
// BUILD ITEM SELECTIONS
// ================================================

function buildItemSelections(item) {
  let selections = [];

  const productCode =
    getProductCode(item.id);

  if (
    productCode === "wayaki_trio"
  ) {
    selections =
      buildTrioSelections(item);

  } else if (
    productCode === "double_up"
  ) {
    selections =
      buildDoubleUpSelections(item);

  } else {
    selections =
      buildNormalSelections(item);
  }

  addUpgradeSelection(
    selections,
    item
  );

  return selections;
}


// ================================================
// BUILD CART ITEM
// ================================================

function buildPayloadItem(item) {
  return {
    product_code:
      getProductCode(item.id),

    quantity:
      Number(item.qty) || 1,

    instructions:
      item.instructions || "",

    selections:
      buildItemSelections(item)
  };
}


// ================================================
// BUILD DELIVERY ADDRESS
// ================================================

function buildDeliveryAddress(data) {
  if (
    data.method !== "delivery"
  ) {
    return "";
  }

  const parts = [];

  if (data.address) {
    parts.push(data.address);
  }

  if (data.unit) {
    parts.push(
      `Unit ${data.unit}`
    );
  }

  if (data.postal) {
    parts.push(
      `Singapore ${data.postal}`
    );
  }

  return parts.join(", ");
}


// ================================================
// BUILD ORDER PAYLOAD
//
// Converts:
// Current frontend cart
//
// Into:
// create_order(jsonb) format
// ================================================

export function buildOrderPayload(
  data,
  cart,
  deliveryFee = 0
) {
  const isDelivery =
    data.method === "delivery";

  return {
    customer_name:
      data.name?.trim() || "",

    customer_phone:
      data.phone?.trim() || "",

    order_date:
      data.orderDateValue ||
      data.orderDate ||
      "",

    preferred_time:
      data.pickupTime || "",

    fulfilment_method:
      data.method,

    delivery_area:
      isDelivery
        ? data.area || ""
        : "",

    delivery_address:
      isDelivery
        ? buildDeliveryAddress(data)
        : "",

    customer_delivery_paid:
      isDelivery
        ? Number(deliveryFee) || 0
        : 0,

    customer_notes:
      data.notes || "",

    items:
      cart.map(
        buildPayloadItem
      )
  };
}


// ================================================
// CREATE ORDER
//
// Calls PostgreSQL:
//
// create_order(p_payload jsonb)
// ================================================

export async function createOrder(
  payload
) {
  const {
    data,
    error
  } = await supabase.rpc(
    "create_order",
    {
      p_payload: payload
    }
  );

  if (error) {
    console.error(
      "Create order error:",
      error
    );

    throw error;
  }

  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {
    throw new Error(
      "Order was created but no result was returned."
    );
  }

  return data[0];
}

