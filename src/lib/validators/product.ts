import { z } from "zod";


export const ProductSchema = z.object({

  name: z.string()
    .min(3, "Nombre obligatorio"),


  description: z.string()
    .min(5, "Descripción obligatoria"),


  price: z.number()
    .min(0),


  category: z.string()
    .min(2, "Categoría obligatoria"),


  brand: z.string()
    .min(2, "Marca obligatoria"),


  image: z.string()
    .optional(),


  stock: z.number()
    .min(0),


  slug: z.string()
    .min(2, "Slug obligatorio"),


  sku: z.string()
    .min(2, "SKU obligatorio"),


  featured: z.boolean(),


  active: z.boolean(),


  discount: z.number()
    .min(0),


  weight: z.number()
    .min(0),


});



export type ProductFormData = z.infer<
  typeof ProductSchema
>;