import { supabase } from "@/lib/supabase";


export interface OrderProduct {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  products: OrderProduct[];
  total: number;
}

export async function createOrder(order: OrderData) {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .insert({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      customer_address: order.customer_address,
      products: order.products,
      total: order.total,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrders() {
  const {
    data,
    error,
  } = await supabase
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
  const {
    data,
    error,
  } = await supabase
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

  Esto evita que una persona pueda consultar
  cualquier pedido simplemente cambiando el ID.
*/
export async function getOrderByIdAndEmail(
  id: number,
  email: string
) {
  const {
    data,
    error,
  } = await supabase
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

export async function updateOrderStatus(
  id: number,
  status: string
) {
  // Primero buscamos el pedido
  const {
    data: order,
    error: getError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (getError) {
    throw getError;
  }

  // Actualizamos el estado
  const {
    error: updateError,
  } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", id);

  if (updateError) {
    throw updateError;
  }

  // Enviamos el correo mediante una ruta del servidor
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

          orderId:
            order.id,

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

export async function deleteOrder(id: number) {
  const {
    error,
  } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}