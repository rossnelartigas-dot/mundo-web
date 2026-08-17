"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; // Tu cliente de Supabase

export async function toggleProductField(
  id: string | number,
  field: "active" | "featured",
  currentValue: boolean
) {
  const { error } = await supabase
    .from("products")
    .update({ [field]: !currentValue })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/products");
  }
}