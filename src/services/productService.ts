import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

/**
 * ============================================================
 * TIPO DE DATOS CRUD
 * ============================================================
 *
 * La aplicación utiliza:
 *
 * image: string
 *
 * Pero Supabase puede devolver la columna image como:
 *
 * - string
 * - string[]
 * - null
 * - undefined
 *
 * Por eso RawProduct acepta ambos formatos.
 */

type RawProduct = Omit<
  Product,
  "image" | "image_url"
> & {
  image?: string | string[] | null;
  image_url?: string | null;
};

/**
 * ============================================================
 * NORMALIZAR IMAGEN
 * ============================================================
 *
 * Convierte cualquier formato recibido desde Supabase
 * a un único string para la aplicación.
 */

function normalizeImage(
  image: string | string[] | null | undefined,
  imageUrl: string | null | undefined
): string {
  /*
   * Si image es un array,
   * utilizamos la primera imagen válida.
   */
  if (Array.isArray(image)) {
    const firstImage = image.find(
      (value) =>
        typeof value === "string" &&
        value.trim() !== ""
    );

    if (firstImage) {
      return firstImage.trim();
    }
  }

  /*
   * Si image es un string.
   */
  if (
    typeof image === "string" &&
    image.trim() !== ""
  ) {
    return image.trim();
  }

  /*
   * Si image no existe,
   * utilizamos image_url como respaldo.
   */
  if (
    typeof imageUrl === "string" &&
    imageUrl.trim() !== ""
  ) {
    return imageUrl.trim();
  }

  return "";
}

/**
 * ============================================================
 * NORMALIZAR PRODUCTO
 * ============================================================
 *
 * El resto de la aplicación siempre recibe:
 *
 * image: string
 */

function normalizeProduct(
  product: RawProduct
): Product {
  const image = normalizeImage(
    product.image,
    product.image_url
  );

  return {
    ...product,

    image,

    image_url:
      typeof product.image_url === "string" &&
      product.image_url.trim() !== ""
        ? product.image_url.trim()
        : image || null,
  };
}

/**
 * ============================================================
 * NORMALIZAR LISTA DE PRODUCTOS
 * ============================================================
 */

function normalizeProducts(
  products: RawProduct[]
): Product[] {
  return products.map(normalizeProduct);
}

/**
 * ============================================================
 * PREPARAR IMAGEN PARA SUPABASE
 * ============================================================
 *
 * Si la columna image de Supabase es text[],
 * convertimos el string de la aplicación a:
 *
 * ["https://..."]
 *
 * La aplicación, sin embargo, continúa trabajando
 * con image: string.
 */

function prepareImageForDatabase(
  image: string | null | undefined
): string[] {
  if (
    typeof image !== "string" ||
    image.trim() === ""
  ) {
    return [];
  }

  return [image.trim()];
}

/**
 * ============================================================
 * OBTENER TODOS LOS PRODUCTOS
 * ============================================================
 */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return normalizeProducts(
    data as RawProduct[]
  );
}

/**
 * ============================================================
 * OBTENER PRODUCTO POR ID
 * ============================================================
 */

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

  return normalizeProduct(
    data as RawProduct
  );
}

/**
 * ============================================================
 * CREAR PRODUCTO
 * ============================================================
 */

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {
  /*
   * Product.image es string.
   */
  const image =
    typeof product.image === "string"
      ? product.image.trim()
      : "";

  /*
   * image_url es opcional.
   */
  const imageUrl =
    typeof product.image_url === "string"
      ? product.image_url.trim()
      : "";

  /*
   * Si existe image utilizamos esa.
   * De lo contrario utilizamos image_url.
   */
  const finalImage =
    image || imageUrl;

  /*
   * Preparamos el objeto para Supabase.
   */
  const databaseProduct = {
    ...product,

    /*
     * Si Supabase tiene image como text[],
     * aquí hacemos la conversión.
     */
    image:
      prepareImageForDatabase(
        finalImage
      ),

    /*
     * image_url continúa como string | null.
     */
    image_url:
      finalImage || null,
  };

  const { error } = await supabase
    .from("products")
    .insert(databaseProduct);

  if (error) {
    throw error;
  }
}

/**
 * ============================================================
 * ACTUALIZAR PRODUCTO
 * ============================================================
 */

export async function updateProduct(
  id: number,
  product: Partial<Product>
) {
  /*
   * Copiamos los campos normales.
   */
  const updateData: Record<string, unknown> = {
    ...product,
  };

  /**
   * ==========================================================
   * IMAGEN
   * ==========================================================
   *
   * La aplicación envía:
   *
   * image: string
   *
   * Pero si Supabase utiliza text[],
   * aquí convertimos:
   *
   * "https://imagen.jpg"
   *
   * en:
   *
   * ["https://imagen.jpg"]
   */

  if ("image" in product) {
    const image =
      typeof product.image === "string"
        ? product.image.trim()
        : "";

    updateData.image =
      prepareImageForDatabase(
        image
      );

    /*
     * Si no se envió image_url,
     * sincronizamos automáticamente.
     */
    if (!("image_url" in product)) {
      updateData.image_url =
        image || null;
    }
  }

  /**
   * ==========================================================
   * IMAGE_URL
   * ==========================================================
   */

  if ("image_url" in product) {
    const imageUrl =
      typeof product.image_url === "string" &&
      product.image_url.trim() !== ""
        ? product.image_url.trim()
        : null;

    updateData.image_url =
      imageUrl;

    /*
     * Si solamente se actualizó image_url,
     * también sincronizamos image.
     */
    if (!("image" in product)) {
      updateData.image =
        prepareImageForDatabase(
          imageUrl
        );
    }
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * ============================================================
 * ELIMINAR PRODUCTO
 * ============================================================
 */

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

/**
 * ============================================================
 * OBTENER PRODUCTO POR SLUG
 * ============================================================
 */

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

  return normalizeProduct(
    data as RawProduct
  );
}