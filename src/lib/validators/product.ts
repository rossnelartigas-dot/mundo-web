import { z } from "zod";


export const ProductSchema = z.object({

  name: z.string()
  .min(3,"Nombre obligatorio"),


  description: z.string()
  .min(5,"Descripción obligatoria"),


  price: z.coerce.number()
  .min(0),


  category: z.string()
  .min(2),


  brand: z.string()
  .min(2),


  image: z.string()
  .optional(),


  stock: z.coerce.number()
  .min(0),


  slug: z.string()
  .min(2),


  sku: z.string()
  .min(2),


  featured: z.boolean()
  .default(false),


  active: z.boolean()
  .default(true),


  discount: z.coerce.number()
  .min(0)
  .default(0),


  weight: z.coerce.number()
  .min(0)
  .default(0)

});


export type ProductFormData =
z.infer<typeof ProductSchema>;