"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  FaLayerGroup,
  FaDollarSign,
  FaImage,
  FaTags,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

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

  const currentImage =
    product.image ||
    product.image_url ||
    "";

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

  const onSubmit: SubmitHandler<
    ProductEditFormData
  > = async (data) => {
    try {
      setLoading(true);

      let imageUrl =
        data.image?.trim() || "";

      if (imageFile) {
        imageUrl =
          await uploadProductImage(
            imageFile
          );
      }

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

  const handleFileChange = (
    file: File | null
  ) => {
    setImageFile(file);
  };

  const inputStyles =
    "w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/80 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono";
  const labelStyles =
    "mb-2 block text-xs font-mono uppercase tracking-wider text-slate-300";
  const helperStyles =
    "mt-1.5 text-[11px] font-mono text-slate-500";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* ======================================================
          SECCIÓN 1: INFORMACIÓN PRINCIPAL
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaLayerGroup size={14} />
          Información del Producto
        </div>

        <div>
          <label className={labelStyles}>
            Nombre <span className="text-cyan-400">*</span>
          </label>
          <input
            {...register("name", { required: true })}
            placeholder="Nombre del producto"
            className={inputStyles}
          />
        </div>

        <div>
          <label className={labelStyles}>
            Descripción
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Descripción detallada..."
            className={`${inputStyles} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelStyles}>
              Marca
            </label>
            <input
              {...register("brand")}
              placeholder="Marca del producto"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Categoría
            </label>
            <input
              {...register("category")}
              placeholder="Categoría"
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 2: PRECIO Y STOCK
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaDollarSign size={14} />
          Precio e Inventario
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelStyles}>
              Precio de venta ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Stock disponible
            </label>
            <input
              type="number"
              {...register("stock", {
                valueAsNumber: true,
              })}
              placeholder="0"
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 3: IMAGEN
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaImage size={14} />
          Imagen del Producto
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-5">
          <ImageUploader
            imageUrl={currentImage}
            onImageChange={handleFileChange}
          />

          <div className="border-t border-slate-800/80 pt-4">
            <label className={labelStyles}>
              O introducir URL externa directa
            </label>
            <input
              {...register("image")}
              className={inputStyles}
              placeholder="https://..."
            />
            <p className={helperStyles}>
              Puedes introducir una URL o seleccionar una imagen desde tu PC.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 4: ESTADO Y VISIBILIDAD
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaTags size={14} />
          Visibilidad en la Tienda
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-950">
            <input
              type="checkbox"
              {...register("featured")}
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-cyan-500 accent-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="block font-mono text-xs font-bold text-slate-200 uppercase">
                Producto Destacado
              </span>
              <span className="block font-mono text-[11px] text-slate-500">
                Mostrar en carrusel de la página de inicio
              </span>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-950">
            <input
              type="checkbox"
              {...register("active")}
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-cyan-500 accent-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="block font-mono text-xs font-bold text-slate-200 uppercase">
                Producto Activo
              </span>
              <span className="block font-mono text-[11px] text-slate-500">
                Visible para clientes en el catálogo público
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* ======================================================
          BOTONES
      ====================================================== */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-7
            py-3.5
            font-mono
            text-sm
            font-bold
            text-slate-950
            shadow-[0_0_20px_rgba(6,182,212,0.3)]
            transition-all
            hover:bg-cyan-400
            hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <FaCheck size={14} />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-800
            bg-slate-900/80
            px-6
            py-3.5
            font-mono
            text-sm
            font-semibold
            text-slate-300
            transition-all
            hover:border-slate-700
            hover:bg-slate-800
            hover:text-white
          "
        >
          <FaTimes size={13} />
          Cancelar
        </button>
      </div>
    </form>
  );
}