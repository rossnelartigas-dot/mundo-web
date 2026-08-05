import { supabase } from "@/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}