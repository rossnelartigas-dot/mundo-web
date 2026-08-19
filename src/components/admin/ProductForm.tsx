"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  ProductSchema,
  ProductFormData,
} from "@/lib/validators/product";

import {
  createProduct,
  updateProduct,
} from "@/services/productService";

import {
  uploadProductImage,
} from "@/services/storageService";

import { Product } from "@/types/product";

import ImageUploader from "./ImageUploader";

interface Props {
  product?: Product;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // La interfaz Product define image como string.
  // Usamos image_url como respaldo por compatibilidad con productos existentes.
  const initialImage = product?.image || product?.image_url || "";

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as Resolver<ProductFormData, unknown>,

    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      cost_price: product?.cost_price ?? 0,
      profit_margin: product?.profit_margin ?? 0,
      category: product?.category || "",
      subcategory: product?.subcategory || "",
      brand: product?.brand || "",
      condition: product?.condition || "nuevo",
      image: initialImage,
      stock: product?.stock ?? 0,
      slug: product?.slug || "",
      sku: product?.sku || "",
      featured: product?.featured ?? false,
      active: product?.active ?? true,
      discount: product?.discount ?? 0,
      weight: product?.weight ?? 0,
      warranty_months: product?.warranty_months ?? 0,
    },
  });

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  const nameRegister = register("name");

  function handleNameChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const value = e.target.value;

    // Mantener sincronizado React Hook Form.
    nameRegister.onChange(e);

    // Generar slug solamente al crear un producto.
    if (!product) {
      setValue("slug", generateSlug(value));
    }
  }

  async function onSubmit(data: ProductFormData): Promise<void> {
    try {
      setLoading(true);

      let imageUrl = data.image || "";

      // Si se seleccionó una nueva imagen desde la PC,
      // primero la subimos y usamos la URL resultante.
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const normalizedImageUrl = imageUrl.trim();

      const productData = {
        name: data.name,
        description: data.description ?? "",
        price: data.price ?? 0,
        cost_price: data.cost_price ?? 0,
        profit_margin: data.profit_margin ?? 0,
        discount: data.discount ?? 0,
        stock: data.stock ?? 0,
        category: data.category ?? "",
        subcategory: data.subcategory ?? "",
        brand: data.brand ?? "",
        condition: data.condition || "nuevo",
        weight: data.weight ?? 0,
        warranty_months: data.warranty_months ?? 0,
        featured: Boolean(data.featured),
        active: Boolean(data.active),
        sku: data.sku?.trim() || "",
        slug: data.slug?.trim() || generateSlug(data.name),

        // Product.image es string, no string[].
        image: normalizedImageUrl,

        // Mantener image_url sincronizado.
        image_url: normalizedImageUrl,
      };

      if (product) {
        await updateProduct(product.id, productData);
        alert("Producto actualizado correctamente");
      } else {
        await createProduct(productData);
        alert("Producto creado correctamente");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Error guardando producto");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (file: File | null) => {
    setImageFile(file);

    // Si se elimina la imagen desde ImageUploader,
    // también eliminamos la URL del formulario.
    if (!file) {
      setValue("image", "");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
    >
      {/* Nombre del Producto */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          Nombre del Producto *
        </label>

        <input
          {...nameRegister}
          onChange={handleNameChange}
          placeholder="Ej: Laptop Dell XPS 13"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        />

        <p className="text-red-500 text-sm mt-1">
          {errors.name?.message}
        </p>
      </div>

      {/* Descripción */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700">
          Descripción
        </label>

        <textarea
          {...register("description")}
          rows={4}
          placeholder="Detalles sobre las especificaciones del producto..."
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        />
      </div>

      {/* Clasificación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Marca
          </label>

          <input
            {...register("brand")}
            placeholder="Ej: Dell, ASUS"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Categoría
          </label>

          <input
            {...register("category")}
            placeholder="Ej: Computación"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Subcategoría
          </label>

          <input
            {...register("subcategory")}
            placeholder="Ej: Laptops"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Condición
          </label>

          <select
            {...register("condition")}
            className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          >
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
            <option value="reacondicionado">
              Reacondicionado
            </option>
          </select>
        </div>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Costo ($)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("cost_price", {
              valueAsNumber: true,
            })}
            placeholder="0.00"
            className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Margen Ganancia (%)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("profit_margin", {
              valueAsNumber: true,
            })}
            placeholder="30"
            className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Precio de Venta ($) *
          </label>

          <input
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
            })}
            placeholder="0.00"
            className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition font-semibold text-emerald-600"
          />

          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Stock (Inventario) *
          </label>

          <input
            type="number"
            {...register("stock", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />

          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">
              {errors.stock.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Descuento (%)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("discount", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Peso (Kg)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("weight", {
              valueAsNumber: true,
            })}
            placeholder="0.00"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Garantía (Meses)
          </label>

          <input
            type="number"
            {...register("warranty_months", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* SKU y Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            SKU (Código único)
          </label>

          <input
            {...register("sku")}
            placeholder="Ej: LAP-DELL-001"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />

          {errors.sku && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sku.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Slug URL (Opcional)
          </label>

          <input
            {...register("slug")}
            placeholder="ej-laptop-dell-xps-13"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />

          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

      {/* Imagen */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-semibold text-gray-700">
          Imagen del Producto
        </label>

        <ImageUploader
          imageUrl={initialImage}
          onImageChange={handleFileChange}
        />

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-500">
            O ingresa URL de imagen directamente
          </label>

          <input
            {...register("image")}
            placeholder="https://imagen.com/producto.jpg"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition text-sm"
          />
        </div>
      </div>

      {/* Publicación */}
      <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
        <label className="flex gap-2 items-center cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("featured")}
            className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
          />

          <span className="text-sm font-medium text-gray-700">
            Producto destacado
          </span>
        </label>

        <label className="flex gap-2 items-center cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("active")}
            className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
          />

          <span className="text-sm font-medium text-gray-700">
            Producto activo en tienda
          </span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading
            ? "Guardando..."
            : product
              ? "Guardar cambios"
              : "Crear producto"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}