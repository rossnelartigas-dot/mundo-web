import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

/**
 * Normaliza las imágenes de un producto.
 *
 * Garantiza que:
 * - image siempre sea string
 * - image_url siempre sea string
 * - si image está vacío, utiliza image_url
 * - si ambos están vacíos o tienen un formato inválido, devuelve ""
 */
function normalizeProduct(product: Product): Product {
  const rawImage = product.image;
  const rawImageUrl = product.image_url;

  const image =
    typeof rawImage === "string" && rawImage.trim()
      ? rawImage.trim()
      : typeof rawImageUrl === "string" && rawImageUrl.trim()
        ? rawImageUrl.trim()
        : "";

  return {
    ...product,
    image,
    image_url: image,
  };
}

/**
 * Normaliza una lista de productos.
 */
function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}


/* =========================================================
   OBTENER TODOS LOS PRODUCTOS
========================================================= */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return normalizeProducts(data as Product[]);
}


/* =========================================================
   OBTENER PRODUCTO POR ID
========================================================= */

export async function getProduct(
  id: number
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeProduct(data as Product);
}


/* =========================================================
   CREAR PRODUCTO
========================================================= */

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {
  const image =
    typeof product.image === "string"
      ? product.image.trim()
      : "";

  const image_url =
    typeof product.image_url === "string"
      ? product.image_url.trim()
      : image;

  const normalizedProduct = {
    ...product,
    image: image || image_url,
    image_url: image_url || image,
  };

  const { error } = await supabase
    .from("products")
    .insert(normalizedProduct);

  if (error) {
    throw error;
  }
}


/* =========================================================
   ACTUALIZAR PRODUCTO
========================================================= */

export async function updateProduct(
  id: number,
  product: Partial<Product>
) {
  const updateData = {
    ...product,
  };

  if ("image" in product || "image_url" in product) {
    const image =
      typeof product.image === "string"
        ? product.image.trim()
        : "";

    const image_url =
      typeof product.image_url === "string"
        ? product.image_url.trim()
        : image;

    updateData.image = image || image_url;
    updateData.image_url = image_url || image;
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw error;
  }
}


/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

export async function deleteProduct(
  id: number
) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}


/* =========================================================
   OBTENER PRODUCTO POR SLUG
========================================================= */

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return normalizeProduct(data as Product);
}