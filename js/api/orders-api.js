// ================================================
// ORDERS API
// Read and manage orders from Supabase
// ================================================

import {
  supabase
} from "../supabase-config.js";


// ================================================
// GET ORDERS
// Load orders with products + selections
// ================================================

export async function getOrders() {
  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      order_date,
      preferred_time,
      fulfilment_method,
      delivery_area,
      delivery_address,
      customer_delivery_paid,
      driver_paid,
      status,
      customer_notes,
      admin_notes,
      created_at,

      order_items (
        id,
        quantity,
        base_price,
        unit_price,
        item_notes,

        products (
          id,
          code,
          name
        ),

        item_selections (
          id,
          selection_group,
          selection_type,
          selection_value,
          price_adjustment,
          quantity
        )
      )
    `)
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {
    console.error(
      "Get orders error:",
      error
    );

    throw error;
  }

  return data || [];
}

// ================================================
// UPDATE ORDER STATUS
// Change pending / confirmed / completed / cancelled
// ================================================

export async function updateOrderStatus(
  orderId,
  status
) {
  const {
    data,
    error
  } = await supabase
    .from("orders")
    .update({
      status,
      updated_at:
        new Date().toISOString()
    })
    .eq(
      "id",
      orderId
    )
    .select(`
      id,
      order_number,
      status,
      updated_at
    `)
    .single();

  if (error) {
    console.error(
      "Update order status error:",
      error
    );

    throw error;
  }

  return data;
}