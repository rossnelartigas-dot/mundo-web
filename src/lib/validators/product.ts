import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),

  description: z.string().optional().or(z.literal("")),

  // Permite números con decimales y valores por defecto
  price: z.coerce.number().min(0, "El precio no puede ser negativo").optional(),

  category: z.string().optional().or(z.literal("")),

  brand: z.string().optional().or(z.literal("")),

  image: z.string().optional().or(z.literal("")),

  stock: z.coerce.number().min(0, "El stock no puede ser negativo").optional(),

  // 🔴 SKU y SLUG AHORA SON OPCIONALES
  slug: z.string().optional().nullable().or(z.literal("")),

  sku: z.string().optional().nullable().or(z.literal("")),

  featured: z.boolean().default(false),

  active: z.boolean().default(true),

  discount: z.coerce.number().min(0).optional(),

  weight: z.coerce.number().min(0).optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;