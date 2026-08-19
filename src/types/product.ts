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

  image_url?: string;

  image?: string;

  active: boolean;

  featured: boolean;

  weight?: number;

  warranty_months?: number;

  created_at?: string;
}