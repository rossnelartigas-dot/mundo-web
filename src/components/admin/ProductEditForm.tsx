"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { useRouter } from "next/navigation";

import { Product } from "@/types/product";
import { updateProduct } from "@/services/productService";
import { uploadProductImage } from "@/services/storageService";

import ImageUploader from "./ImageUploader";

interface Props {
  product: Product;
}

interface ProductEditFormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  featured: boolean;
  active: boolean;
}

export default function ProductEditForm({
  product,
}: Props) {
  const router = useRouter();

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  /*
   * ==========================================================
   * IMAGEN ACTUAL
   * ==========================================================
   *
   * Product.image es string.
   * image_url funciona como respaldo para productos antiguos.
   */

  const currentImage =
    product.image ||
    product.image_url ||
    "";

  /*
   * ==========================================================
   * FORMULARIO
   * ==========================================================
   */

  const {
    register,
    handleSubmit,
  } = useForm<ProductEditFormData>({
    defaultValues: {
      name:
        product.name || "",

      description:
        product.description || "",

      brand:
        product.brand || "",

      category:
        product.category || "",

      price:
        Number(product.price) || 0,

      stock:
        Number(product.stock) || 0,

      image:
        currentImage,

      featured:
        product.featured ?? false,

      active:
        product.active ?? true,
    },
  });

  /*
   * ==========================================================
   * GUARDAR CAMBIOS
   * ==========================================================
   */

  const onSubmit: SubmitHandler<
    ProductEditFormData
  > = async (data) => {
    try {
      setLoading(true);

      /*
       * URL introducida manualmente.
       */
      let imageUrl =
        data.image?.trim() || "";

      /*
       * Si se selecciona una imagen desde la PC,
       * tiene prioridad sobre la URL.
       */
      if (imageFile) {
        imageUrl =
          await uploadProductImage(
            imageFile
          );
      }

      /*
       * ======================================================
       * ACTUALIZAR PRODUCTO
       * ======================================================
       *
       * Product.image es string.
       * La conversión al formato de Supabase,
       * si fuera necesaria, se realiza dentro de
       * productService.
       */

      await updateProduct(
        product.id,
        {
          name:
            data.name.trim(),

          description:
            data.description?.trim() || "",

          brand:
            data.brand?.trim() || "",

          category:
            data.category?.trim() || "",

          price:
            Number(data.price) || 0,

          stock:
            Number(data.stock) || 0,

          image:
            imageUrl,

          image_url:
            imageUrl || null,

          featured:
            data.featured,

          active:
            data.active,
        }
      );

      alert(
        "Producto actualizado correctamente"
      );

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Error actualizando producto:",
        error
      );

      alert(
        "Error actualizando producto"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * CAMBIO DE ARCHIVO
   * ==========================================================
   */

  const handleFileChange = (
    file: File | null
  ) => {
    setImageFile(file);
  };

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* ======================================================
          NOMBRE
      ====================================================== */}

      <div>
        <label className="mb-2 block font-medium">
          Nombre
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* ======================================================
          DESCRIPCIÓN
      ====================================================== */}

      <div>
        <label className="mb-2 block font-medium">
          Descripción
        </label>

        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* ======================================================
          MARCA / CATEGORÍA
      ====================================================== */}

      <div className="grid grid-cols-2 gap-5">
        <input
          {...register("brand")}
          placeholder="Marca"
          className="rounded-lg border p-3"
        />

        <input
          {...register("category")}
          placeholder="Categoría"
          className="rounded-lg border p-3"
        />
      </div>

      {/* ======================================================
          PRECIO / STOCK
      ====================================================== */}

      <div className="grid grid-cols-2 gap-5">
        <input
          type="number"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
          })}
          placeholder="Precio"
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          {...register("stock", {
            valueAsNumber: true,
          })}
          placeholder="Stock"
          className="rounded-lg border p-3"
        />
      </div>

      {/* ======================================================
          IMAGEN DESDE PC
      ====================================================== */}

      <div>
        <ImageUploader
          imageUrl={currentImage}
          onImageChange={
            handleFileChange
          }
        />
      </div>

      {/* ======================================================
          URL DE IMAGEN
      ====================================================== */}

      <div>
        <label className="mb-2 block font-medium">
          URL de imagen
        </label>

        <input
          {...register("image")}
          className="w-full rounded-lg border p-3"
          placeholder="https://..."
        />

        <p className="mt-1 text-xs text-slate-500">
          Puedes introducir una URL o seleccionar
          una imagen desde tu PC.
        </p>
      </div>

      {/* ======================================================
          DESTACADO
      ====================================================== */}

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("featured")}
        />

        <label>
          Producto destacado
        </label>
      </div>

      {/* ======================================================
          ACTIVO
      ====================================================== */}

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("active")}
        />

        <label>
          Producto activo
        </label>
      </div>

      {/* ======================================================
          BOTONES
      ====================================================== */}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Guardando..."
            : "Guardar cambios"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white transition hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}