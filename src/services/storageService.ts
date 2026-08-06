import { supabase } from "@/lib/supabase";

export async function uploadProductImage(file: File) {
  const extension = file.name.split(".").pop();

  const fileName = `${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return publicUrl;
}