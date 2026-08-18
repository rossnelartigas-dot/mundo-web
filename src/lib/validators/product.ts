import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),

  description: z.string().optional().or(z.literal("")),

  // Precios y Margen
  price: z.coerce.number().min(0, "El precio no puede ser negativo").optional(),
  cost_price: z.coerce.number().min(0, "El costo no puede ser negativo").optional(),
  profit_margin: z.coerce.number().optional(),

  // Categorización y Condición
  category: z.string().optional().or(z.literal("")),
  subcategory: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  condition: z.string().optional().or(z.literal("")),

  // Imagen e Inventario
  image: z.string().optional().or(z.literal("")),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo").optional(),

  // Opciones opcionales y códigos
  slug: z.string().optional().nullable().or(z.literal("")),
  sku: z.string().optional().nullable().or(z.literal("")),

  // Atributos adicionales
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  discount: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().min(0).optional(),
  warranty_months: z.coerce.number().min(0).optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;