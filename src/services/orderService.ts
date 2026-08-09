
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


export async function createOrder(
  order: OrderData
) {

  const {
    data,
    error,
  } = await supabase

    .from("orders")

    .insert({

      customer_name:
        order.customer_name,

      customer_phone:
        order.customer_phone,

      customer_email:
        order.customer_email,

      customer_address:
        order.customer_address,

      products:
        order.products,

      total:
        order.total,

      status:
        "pending",

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

    .order(
      "created_at",
      {
        ascending: false,
      }
    );


  if (error) {

    throw error;

  }


  return data;

}


export async function getOrder(
  id: number
) {

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


export async function updateOrderStatus(

  id: number,

  status: string

) {

  const {
    error,
  } = await supabase

    .from("orders")

    .update({

      status,

    })

    .eq(
      "id",
      id
    );


  if (error) {

    throw error;

  }

}


export async function deleteOrder(
  id: number
) {

  const {
    error,
  } = await supabase

    .from("orders")

    .delete()

    .eq(
      "id",
      id
    );


  if (error) {

    throw error;

  }

}