"use client";

import { useEffect, useRef, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { useRouter } from "next/navigation";

import { createProduct } from "@/services/productService";
import { uploadProductImage } from "@/services/storageService";

import ImageUploader from "./ImageUploader";

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  condition: string;
  price: number;
  cost_price: number;
  profit_margin: number;
  discount: number;
  stock: number;
  sku: string;
  slug: string;
  image: string;
  featured: boolean;
  active: boolean;
  weight: number;
  warranty_months: number;
}

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm() {
  const router = useRouter();

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  /*
   * Indica si el usuario modificó manualmente
   * el slug generado automáticamente.
   */
  const slugManuallyEdited =
    useRef(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      subcategory: "",
      condition: "Nuevo",
      price: 0,
      cost_price: 0,
      profit_margin: 0,
      discount: 0,
      stock: 0,
      sku: "",
      slug: "",
      image: "",
      featured: false,
      active: true,
      weight: 0,
      warranty_months: 0,
    },
  });

  /*
   * ==========================================================
   * VALORES OBSERVADOS
   * ==========================================================
   *
   * useWatch reemplaza watch() para evitar el warning
   * del React Compiler.
   */

  const name = useWatch({
    control,
    name: "name",
  });

  const costPrice = useWatch({
    control,
    name: "cost_price",
  });

  const profitMargin = useWatch({
    control,
    name: "profit_margin",
  });

  const imageUrl = useWatch({
    control,
    name: "image",
  });

  /*
   * ==========================================================
   * SLUG AUTOMÁTICO
   * ==========================================================
   *
   * Mientras el usuario no haya modificado manualmente
   * el slug, éste se genera automáticamente a partir
   * del nombre del producto.
   */

  useEffect(() => {
    if (slugManuallyEdited.current) {
      return;
    }

    const generatedSlug =
      generateSlug(name || "");

    setValue(
      "slug",
      generatedSlug,
      {
        shouldDirty: true,
      }
    );
  }, [name, setValue]);

  /*
   * ==========================================================
   * PRECIO AUTOMÁTICO
   * ==========================================================
   *
   * Precio = Costo + (Costo × Margen / 100)
   *
   * Ejemplo:
   *
   * Costo: 100
   * Margen: 30%
   * Precio: 130
   */

  useEffect(() => {
    const cost =
      Number(costPrice) || 0;

    const margin =
      Number(profitMargin) || 0;

    if (cost <= 0) {
      setValue("price", 0);
      return;
    }

    const calculatedPrice =
      cost +
      (cost * margin) / 100;

    const roundedPrice =
      Math.round(
        calculatedPrice * 100
      ) / 100;

    setValue(
      "price",
      roundedPrice,
      {
        shouldDirty: true,
      }
    );
  }, [
    costPrice,
    profitMargin,
    setValue,
  ]);

  /*
   * ==========================================================
   * CREAR PRODUCTO
   * ==========================================================
   */

  const onSubmit: SubmitHandler<ProductFormData> =
    async (data) => {
      try {
        setLoading(true);

        /*
         * ======================================================
         * IMAGEN
         *
         * Si se selecciona una imagen desde la PC,
         * tiene prioridad sobre la URL.
         * ======================================================
         */

        let finalImageUrl =
          data.image?.trim() || "";

        if (imageFile) {
          finalImageUrl =
            await uploadProductImage(
              imageFile
            );
        }

        /*
         * ======================================================
         * PREPARAR PRODUCTO
         *
         * Product.image es STRING.
         * ======================================================
         */

        const productData = {
          name:
            data.name.trim(),

          description:
            data.description?.trim() || "",

          brand:
            data.brand?.trim() || "",

          category:
            data.category?.trim() || "",

          subcategory:
            data.subcategory?.trim() || "",

          condition:
            data.condition?.trim() || "Nuevo",

          price:
            Number(data.price) || 0,

          cost_price:
            Number(data.cost_price) || 0,

          profit_margin:
            Number(data.profit_margin) || 0,

          discount:
            Number(data.discount) || 0,

          stock:
            Number(data.stock) || 0,

          sku:
            data.sku?.trim() || "",

          slug:
            data.slug?.trim() ||
            generateSlug(data.name),

          /*
           * Product.image es string.
           */
          image:
            finalImageUrl,

          /*
           * Compatibilidad con image_url.
           */
          image_url:
            finalImageUrl
              ? finalImageUrl
              : null,

          featured:
            data.featured,

          active:
            data.active,

          weight:
            Number(data.weight) || 0,

          warranty_months:
            Number(data.warranty_months) || 0,
        };

        await createProduct(
          productData
        );

        alert(
          "Producto creado correctamente"
        );

        router.push(
          "/admin/products"
        );

        router.refresh();
      } catch (error) {
        console.error(
          "Error creando producto:",
          error
        );

        alert(
          "Error creando producto"
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ==========================================================
   * CAMBIO DE IMAGEN
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
          INFORMACIÓN PRINCIPAL
      ====================================================== */}

      <div>
        <label className="mb-2 block font-medium">
          Nombre
        </label>

        <input
          {...register("name")}
          placeholder="Nombre del producto"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Descripción
        </label>

        <textarea
          {...register("description")}
          rows={4}
          placeholder="Descripción del producto"
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* ======================================================
          MARCA / CATEGORÍA
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Marca
          </label>

          <input
            {...register("brand")}
            placeholder="Marca"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Categoría
          </label>

          <input
            {...register("category")}
            placeholder="Categoría"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* ======================================================
          SUBCATEGORÍA / CONDICIÓN
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Subcategoría
          </label>

          <input
            {...register("subcategory")}
            placeholder="Subcategoría"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Condición
          </label>

          <select
            {...register("condition")}
            className="w-full rounded-lg border p-3"
          >
            <option value="Nuevo">
              Nuevo
            </option>

            <option value="Usado">
              Usado
            </option>

            <option value="Reacondicionado">
              Reacondicionado
            </option>
          </select>
        </div>
      </div>

      {/* ======================================================
          SKU / SLUG
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            SKU
          </label>

          <input
            {...register("sku")}
            placeholder="SKU del producto"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Slug
          </label>

          <input
            {...register("slug", {
              onChange: () => {
                slugManuallyEdited.current =
                  true;
              },
            })}
            placeholder="slug-del-producto"
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-xs text-slate-500">
            Se genera automáticamente a partir
            del nombre, pero puedes modificarlo.
          </p>
        </div>
      </div>

      {/* ======================================================
          PRECIO / COSTO
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Precio
          </label>

          <input
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
            })}
            placeholder="Precio de venta"
            className="w-full rounded-lg border p-3 bg-slate-50"
          />

          <p className="mt-1 text-xs text-slate-500">
            Se calcula automáticamente usando
            el costo y el margen.
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Precio de costo
          </label>

          <input
            type="number"
            step="0.01"
            {...register("cost_price", {
              valueAsNumber: true,
            })}
            placeholder="Precio de costo"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* ======================================================
          MARGEN / DESCUENTO / STOCK
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block font-medium">
            Margen de ganancia (%)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("profit_margin", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Descuento (%)
          </label>

          <input
            type="number"
            step="0.01"
            {...register("discount", {
              valueAsNumber: true,
            })}
            placeholder="0"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Stock
          </label>

          <input
            type="number"
            {...register("stock", {
              valueAsNumber: true,
            })}
            placeholder="Cantidad"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* ======================================================
          PESO / GARANTÍA
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            Peso
          </label>

          <input
            type="number"
            step="0.01"
            {...register("weight", {
              valueAsNumber: true,
            })}
            placeholder="Peso"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Garantía (meses)
          </label>

          <input
            type="number"
            {...register("warranty_months", {
              valueAsNumber: true,
            })}
            placeholder="Meses"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      {/* ======================================================
          IMAGEN DESDE PC
      ====================================================== */}

      <div>
        <label className="mb-2 block font-medium">
          Imagen del producto
        </label>

        <ImageUploader
          imageUrl={imageUrl || ""}
          onImageChange={handleFileChange}
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
          placeholder="https://..."
          className="w-full rounded-lg border p-3"
        />

        <p className="mt-1 text-xs text-slate-500">
          Puedes utilizar una URL o subir una imagen
          desde tu PC.
        </p>
      </div>

      {/* ======================================================
          OPCIONES
      ====================================================== */}

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("featured")}
          />

          <span>
            Producto destacado
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("active")}
          />

          <span>
            Producto activo
          </span>
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
            : "Crear producto"}
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
