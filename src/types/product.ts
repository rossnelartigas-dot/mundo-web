export interface Product {
  id: number;
  name: string;
  slug?: string | null;
  sku?: string | null;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  subcategory?: string | null;
  condition?: string | null;
  price: number;
  discount?: number | null;
  cost_price?: number | null;
  profit_margin?: number | null;
  stock: number;
  image_url?: string | null;
  image?: string[] | null;
  active: boolean;
  featured: boolean;
  weight?: number | null;
  warranty_months?: number | null;
  created_at?: string | null;
}