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
  total: number;

  // Tasa BCV utilizada al momento de crear el pedido
  bcv_rate?: number | null;

  // Total equivalente en bolívares
  total_bs?: number | null;
}

/**
 * Crea un pedido (incluyendo método, referencia de pago,
 * tasa BCV y total en bolívares) y descuenta automáticamente
 * del inventario.
 */
export async function createOrder(order: OrderData) {
  // 1. Guardar el pedido en la base de datos
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      customer_address: order.customer_address,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference || null,
      products: order.products,
      total: order.total,

      // Datos de conversión BCV
      bcv_rate: order.bcv_rate ?? null,
      total_bs: order.total_bs ?? null,

      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // 2. Descontar el inventario de cada producto comprado
  if (Array.isArray(order.products)) {
    for (const item of order.products) {
      const { data: productData, error: fetchError } = await supabase
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
          .update({ stock: newStock })
          .eq("id", item.id);
      }
    }
  }

  return data;
}

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

/*
  Consulta un pedido utilizando:
  - Número del pedido
  - Correo electrónico del cliente
*/
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

/**
 * Actualiza el estado del pedido y gestiona la devolución/descuento
 * de inventario.
 */
export async function updateOrderStatus(
  id: number,
  status: string
) {
  // 1. Buscamos el pedido actual para conocer sus items y estado anterior
  const { data: order, error: getError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (getError || !order) {
    throw getError || new Error("Pedido no encontrado");
  }

  const previousStatus = order.status;

  // 2. Actualizamos el nuevo estado en la BD
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  // Identificar si el estado es 'cancelled' / 'cancelado'
  const isCancelled = (st: string) =>
    st.toLowerCase() === "cancelled" ||
    st.toLowerCase() === "cancelado";

  const isNewStatusCancelled = isCancelled(status);
  const wasPreviousStatusCancelled =
    isCancelled(previousStatus);

  // 3. RESTAURAR STOCK:
  // Si pasa de NO cancelado -> CANCELADO
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
        const currentStock = productData.stock ?? 0;

        const restoredStock =
          currentStock + Number(item.quantity || 1);

        await supabase
          .from("products")
          .update({ stock: restoredStock })
          .eq("id", item.id);
      }
    }
  }

  // 4. DESCONTAR STOCK DE NUEVO:
  // Si pasa de CANCELADO -> ACTIVO
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
        const currentStock = productData.stock ?? 0;

        const newStock = Math.max(
          0,
          currentStock - Number(item.quantity || 1)
        );

        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.id);
      }
    }
  }

  // 5. Enviamos el correo de notificación
  try {
    const response = await fetch("/api/order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        orderId: order.id,
        status,
      }),
    });

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

export async function deleteOrder(id: number) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}