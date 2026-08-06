import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),

  description: z.string().min(10, "La descripción es muy corta"),

  brand: z.string().min(2, "La marca es obligatoria"),

  category: z.string().min(2, "La categoría es obligatoria"),

  price: z.coerce.number().positive(),

  stock: z.coerce.number().int().min(0),

  image: z.string().optional(),

  featured: z.boolean().default(false),

  active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof ProductSchema>;