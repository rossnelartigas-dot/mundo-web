import { supabase } from "@/lib/supabase";

export interface OrderProduct {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;

  payment_method: string;
  payment_reference?: string;

  products: OrderProduct[];

  // Total original en USD
  total: number;

  // Tasa BCV utilizada al momento de crear el pedido
  bcv_rate?: number | null;

  // Total convertido a bolívares
  total_bs?: number | null;
}

/**
 * Crea un pedido y descuenta automáticamente
 * del inventario los productos comprados.
 */
export async function createOrder(order: OrderData) {
  // ============================================================
  // 1. GUARDAR PEDIDO
  // ============================================================

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: order.user_id || null,

      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      customer_address: order.customer_address,

      payment_method: order.payment_method,
      payment_reference: order.payment_reference || null,

      products: order.products,

      // Total original en USD
      total: order.total,

      // Tasa BCV utilizada
      bcv_rate: order.bcv_rate ?? null,

      // Total convertido a Bs.
      total_bs: order.total_bs ?? null,

      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // ============================================================
  // 2. DESCONTAR INVENTARIO
  // ============================================================

  if (Array.isArray(order.products)) {
    for (const item of order.products) {
      const { data: productData, error: fetchError } =
        await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

      if (!fetchError && productData) {
        const currentStock = productData.stock ?? 0;

        const newStock = Math.max(
          0,
          currentStock - Number(item.quantity || 1)
        );

        await supabase
          .from("products")
          .update({
            stock: newStock,
          })
          .eq("id", item.id);
      }
    }
  }

  return data;
}

// ============================================================
// OBTENER TODOS LOS PEDIDOS
// ============================================================

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

// ============================================================
// OBTENER PEDIDO POR ID
// ============================================================

export async function getOrder(id: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// ============================================================
// OBTENER PEDIDO POR ID + EMAIL
// ============================================================

export async function getOrderByIdAndEmail(
  id: number,
  email: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("customer_email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ============================================================
// ACTUALIZAR ESTADO DEL PEDIDO
// ============================================================

export async function updateOrderStatus(
  id: number,
  status: string
) {
  // ============================================================
  // 1. OBTENER PEDIDO ACTUAL
  // ============================================================

  const { data: order, error: getError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (getError || !order) {
    throw getError || new Error("Pedido no encontrado");
  }

  const previousStatus = order.status;

  // ============================================================
  // 2. ACTUALIZAR ESTADO
  // ============================================================

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  // ============================================================
  // 3. FUNCIONES PARA DETECTAR CANCELACIÓN
  // ============================================================

  const isCancelled = (st: string) =>
    st.toLowerCase() === "cancelled" ||
    st.toLowerCase() === "cancelado";

  const isNewStatusCancelled =
    isCancelled(status);

  const wasPreviousStatusCancelled =
    isCancelled(previousStatus);

  // ============================================================
  // 4. RESTAURAR STOCK
  //    NO CANCELADO → CANCELADO
  // ============================================================

  if (
    isNewStatusCancelled &&
    !wasPreviousStatusCancelled &&
    Array.isArray(order.products)
  ) {
    for (const item of order.products) {
      const { data: productData } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (productData) {
        const currentStock =
          productData.stock ?? 0;

        const restoredStock =
          currentStock +
          Number(item.quantity || 1);

        await supabase
          .from("products")
          .update({
            stock: restoredStock,
          })
          .eq("id", item.id);
      }
    }
  }

  // ============================================================
  // 5. DESCONTAR STOCK NUEVAMENTE
  //    CANCELADO → ACTIVO
  // ============================================================

  if (
    !isNewStatusCancelled &&
    wasPreviousStatusCancelled &&
    Array.isArray(order.products)
  ) {
    for (const item of order.products) {
      const { data: productData } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (productData) {
        const currentStock =
          productData.stock ?? 0;

        const newStock = Math.max(
          0,
          currentStock -
            Number(item.quantity || 1)
        );

        await supabase
          .from("products")
          .update({
            stock: newStock,
          })
          .eq("id", item.id);
      }
    }
  }

  // ============================================================
  // 6. NOTIFICACIÓN POR CORREO
  // ============================================================

  try {
    const response = await fetch(
      "/api/order-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail:
            order.customer_email,

          customerName:
            order.customer_name,

          orderId: order.id,

          status,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "El pedido fue actualizado, pero el correo no pudo enviarse."
      );
    }
  } catch (emailError) {
    console.error(
      "Pedido actualizado, pero ocurrió un error enviando el correo:",
      emailError
    );
  }

  return true;
}

// ============================================================
// ELIMINAR PEDIDO
// ============================================================

export async function deleteOrder(id: number) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}