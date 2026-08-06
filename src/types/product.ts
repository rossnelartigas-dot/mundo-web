export interface Product {

  id: number;

  name: string;

  description: string;

  price: number;

  category: string;

  brand: string;

  image?: string;

  stock: number;

  featured?: boolean;

  active?: boolean;

  created_at: string;

}