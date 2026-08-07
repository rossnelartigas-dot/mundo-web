export interface Product {

  id: number;

  name: string;

  description: string;

  price: number;

  category: string;

  brand: string;

  image?: string;

  stock: number;

  created_at: string;

  slug: string;

  sku: string;

  featured: boolean;

  active: boolean;

  discount: number;

  weight: number;

}