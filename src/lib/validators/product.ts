import { z } from "zod";


export const ProductSchema = z.object({

  name: z
    .string()
    .min(3, "El nombre debe tener mínimo 3 caracteres"),


  description: z
    .string()
    .min(10, "La descripción es muy corta"),


  brand: z
    .string()
    .min(2, "La marca es obligatoria"),


  category: z
    .string()
    .min(2, "La categoría es obligatoria"),


  price: z.coerce
    .number()
    .positive("El precio debe ser mayor a 0"),


  stock: z.coerce
    .number()
    .int()
    .min(0),


  featured: z.boolean()
    .default(false),


  active: z.boolean()
    .default(true),


  image: z.string()
    .optional()

});


export type ProductFormData = z.infer<typeof ProductSchema>;