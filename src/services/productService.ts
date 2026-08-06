import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";


export async function getProducts(): Promise<Product[]> {

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });


  if (error) {
    console.error(error);
    return [];
  }


  return data as Product[];

}



export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select();


  if (error) {

    console.error(error);
    throw error;

  }


  return data;

}



export async function deleteProduct(id:number){

  const {error}=await supabase
    .from("products")
    .delete()
    .eq("id",id);


  if(error){

    throw error;

  }

}



export async function updateProduct(
  id:number,
  product:Partial<Product>
){

 const {error}=await supabase
 .from("products")
 .update(product)
 .eq("id",id);


 if(error){

  throw error;

 }

}