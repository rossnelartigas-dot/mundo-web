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
<<<<<<<<< Temporary merge branch 1
=========

>>>>>>>>> Temporary merge branch 2
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;

  payment_method: string;
  payment_reference?: string;

<<<<<<<<< Temporary merge branch 1
  products: OrderProduct[];

  // Total original en USD
=========
  // ============================================================
  // DATOS DEL PAGO
  // ============================================================

  payment_bank?: string;
  payment_phone?: string;
  payment_id_number?: string;
  payment_date?: string;
  payment_time?: string;
  payment_amount?: number;

  products: OrderProduct[];
  total: number;

  // Tasa BCV utilizada al momento de crear el pedido
  bcv_rate?: number | null;

  // Total equivalente en bolívares
  total_bs?: number | null;
}

/**
 * Crea un pedido y descuenta automáticamente
 * el inventario de los productos comprados.
 */
export async function createOrder(order: OrderData) {
  // ============================================================
  // 1. CREAR PEDIDO
  // ============================================================

  const { data, error } = await supabase
    .from("orders")
    .insert({
<<<<<<<<< Temporary merge branch 1
=========
      // ==========================================================
      // DATOS DEL CLIENTE
      // ==========================================================

>>>>>>>>> Temporary merge branch 2
      user_id: order.user_id || null,

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

=========
      // ==========================================================
      // MÉTODO DE PAGO
      // ==========================================================

      payment_method: order.payment_method,
      payment_reference:
        order.payment_reference || null,

      // ==========================================================
      // DATOS DEL PAGO
      // ==========================================================

      payment_bank:
        order.payment_bank || null,

      payment_phone:
        order.payment_phone || null,

      payment_id_number:
        order.payment_id_number || null,

      payment_date:
        order.payment_date || null,

      payment_time:
        order.payment_time || null,

      payment_amount:
        order.payment_amount ?? null,

      // ==========================================================
      // PEDIDO
      // ==========================================================

      products: order.products,

      total: order.total,

>>>>>>>>> Temporary merge branch 2
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando pedido:", error);
    throw error;
  }

  // ============================================================
  // 2. DESCONTAR INVENTARIO
  // ============================================================

  if (Array.isArray(order.products)) {
    for (const item of order.products) {
<<<<<<<<< Temporary merge branch 1
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
        currentStock - quantity
      );

      const { error: stockError } = await supabase
        .from("products")
        .update({
          stock: newStock,
        })
        .eq("id", item.id);

      if (stockError) {
        console.error(
          `Error actualizando stock del producto ${item.id}:`,
          stockError
        );
      }
    }
  }

  return data;
}

/**
 * Obtiene todos los pedidos.
 */
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

/**
 * Obtiene un pedido por su ID.
 */
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

/**
 * Consulta un pedido utilizando:
 * - Número del pedido
 * - Correo electrónico del cliente
 *
 * Se utiliza para mostrar el pedido al cliente
 * después de finalizar la compra.
 */
export async function getOrderByIdAndEmail(
  id: number,
  email: string
) {
  const cleanEmail = email
    .trim()
    .toLowerCase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("customer_email", cleanEmail)
    .single();

  if (error) {
    console.error(
      "Error buscando pedido por ID y correo:",
      error
    );

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

<<<<<<<<< Temporary merge branch 1
  const { data: order, error: getError } = await supabase
=========
  const {
    data: order,
    error: getError,
  } = await supabase
>>>>>>>>> Temporary merge branch 2
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (getError || !order) {
    throw (
      getError ||
      new Error("Pedido no encontrado")
    );
  }

  const previousStatus = order.status;

  // ============================================================
  // 2. ACTUALIZAR ESTADO
  // ============================================================

  const { error: updateError } =
    await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  // ============================================================
<<<<<<<<< Temporary merge branch 1
  // 3. FUNCIONES PARA DETECTAR CANCELACIÓN
=========
  // 3. DETECTAR CANCELACIÓN
>>>>>>>>> Temporary merge branch 2
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
  //
  // NO CANCELADO -> CANCELADO
  // ============================================================

  if (
    isNewStatusCancelled &&
    !wasPreviousStatusCancelled &&
    Array.isArray(order.products)
  ) {
    for (const item of order.products) {
      const quantity = Number(
        item.quantity || 1
      );

      if (quantity <= 0) {
        continue;
      }

      const { data: productData, error } =
        await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

      if (error || !productData) {
        console.error(
          `No se pudo obtener el producto ${item.id} para restaurar stock.`,
          error
        );
        continue;
      }

      const currentStock = Number(
        productData.stock ?? 0
      );

      const restoredStock =
        currentStock + quantity;

      const { error: stockError } =
        await supabase
          .from("products")
          .update({
            stock: restoredStock,
          })
          .eq("id", item.id);

      if (stockError) {
        console.error(
          `Error restaurando stock del producto ${item.id}:`,
          stockError
        );
      }
    }
  }

  // ============================================================
  // 5. DESCONTAR STOCK NUEVAMENTE
  //
  // CANCELADO -> ACTIVO
  // ============================================================

  if (
    !isNewStatusCancelled &&
    wasPreviousStatusCancelled &&
    Array.isArray(order.products)
  ) {
    for (const item of order.products) {
      const quantity = Number(
        item.quantity || 1
      );

      if (quantity <= 0) {
        continue;
      }

      const { data: productData, error } =
        await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

      if (error || !productData) {
        console.error(
          `No se pudo obtener el producto ${item.id} para descontar stock.`,
          error
        );
        continue;
      }

      const currentStock = Number(
        productData.stock ?? 0
      );

      const newStock = Math.max(
        0,
        currentStock - quantity
      );

      const { error: stockError } =
        await supabase
          .from("products")
          .update({
            stock: newStock,
          })
          .eq("id", item.id);

      if (stockError) {
        console.error(
          `Error descontando stock del producto ${item.id}:`,
          stockError
        );
      }
    }
  }

  // ============================================================
  // 6. NOTIFICACIÓN DE CAMBIO DE ESTADO
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

/**
 * Elimina un pedido por ID.
 */
export async function deleteOrder(
  id: number
) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}