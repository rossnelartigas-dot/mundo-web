export interface Product {
  id: number;

  name: string;

  slug?: string;

  sku?: string;

  description?: string;

  brand?: string;

  category?: string;

  subcategory?: string;

  condition?: string;

  price: number;

  discount?: number;

  cost_price?: number;

  profit_margin?: number;

  stock: number;

  /**
   * Imagen principal del producto.
   *
   * La aplicación trabaja con una sola URL.
   * productService se encarga de normalizar el valor
   * que venga desde Supabase.
   */
  image: string;

  /**
   * URL alternativa/compatibilidad con registros antiguos.
   */
  image_url?: string | null;

  active: boolean;

  featured: boolean;

  weight?: number;

  warranty_months?: number;

  created_at?: string;
}