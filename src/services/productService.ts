import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";


export async function getProducts(): Promise<Product[]> {

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });


  if (error) throw error;


  return data as Product[];

}



export async function getProduct(
  id:number
): Promise<Product | null> {


  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();



  if(error) return null;



  return data as Product;

}




export async function createProduct(

  product: Omit<Product,"id" | "created_at">

){


  const { error } = await supabase
    .from("products")
    .insert(product);



  if(error) throw error;


}




export async function updateProduct(

  id:number,

  product:Partial<Product>

){


  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id",id);



  if(error) throw error;


}




export async function deleteProduct(

  id:number

){


  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id",id);



  if(error) throw error;


}
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {


  const { data, error } = await supabase

    .from("products")

    .select("*")

    .eq("slug", slug)

    .single();



  if (error) {

    console.error(error);

    return null;

  }



  return data as Product;

}