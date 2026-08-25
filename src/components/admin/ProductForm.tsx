"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  FaBox,
  FaDollarSign,
  FaImage,
  FaLayerGroup,
  FaCheck,
  FaTimes,
  FaTags,
  FaCalculator,
} from "react-icons/fa";

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
  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

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
   */

  useEffect(() => {
    if (slugManuallyEdited) {
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
  }, [name, slugManuallyEdited, setValue]);

  /*
   * ==========================================================
   * PRECIO AUTOMÁTICO
   * ==========================================================
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

        let finalImageUrl =
          data.image?.trim() || "";

        if (imageFile) {
          finalImageUrl =
            await uploadProductImage(
              imageFile
            );
        }

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

          image:
            finalImageUrl,

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
          SECCIÓN 1: INFORMACIÓN BÁSICA
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaLayerGroup size={14} />
          Información del Producto
        </div>

        <div>
          <label className={labelStyles}>
            Nombre del producto <span className="text-cyan-400">*</span>
          </label>
          <input
            {...register("name", { required: true })}
            placeholder="Ej. Teclado Mecánico RGB Pro"
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
            placeholder="Detalla las características principales del producto..."
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
              placeholder="Ej. Logitech, Razer, Corsair"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Categoría
            </label>
            <input
              {...register("category")}
              placeholder="Ej. Teclados, Mouse, Monitores"
              className={inputStyles}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelStyles}>
              Subcategoría
            </label>
            <input
              {...register("subcategory")}
              placeholder="Ej. Periféricos Inalámbricos"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Condición
            </label>
            <select
              {...register("condition")}
              className={`${inputStyles} cursor-pointer`}
            >
              <option value="Nuevo" className="bg-slate-950 text-slate-100">
                Nuevo
              </option>
              <option value="Usado" className="bg-slate-950 text-slate-100">
                Usado
              </option>
              <option value="Reacondicionado" className="bg-slate-950 text-slate-100">
                Reacondicionado
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelStyles}>
              SKU
            </label>
            <input
              {...register("sku")}
              placeholder="Ej. PROD-TEC-001"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Slug (Identificador URL)
            </label>
            <input
              {...register("slug", {
                onChange: () => {
                  setSlugManuallyEdited(true);
                },
              })}
              placeholder="slug-del-producto"
              className={inputStyles}
            />
            <p className={helperStyles}>
              Auto-generado desde el nombre. Puedes personalizarlo.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 2: PRECIOS Y FINANZAS
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaDollarSign size={14} />
          Precios y Rentabilidad
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelStyles}>
              Precio de costo ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register("cost_price", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                className={inputStyles}
              />
            </div>
            <p className={helperStyles}>
              Costo unitario de adquisición o importación.
            </p>
          </div>

          <div>
            <label className={labelStyles}>
              Margen de ganancia (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register("profit_margin", {
                  valueAsNumber: true,
                })}
                placeholder="Ej. 30"
                className={inputStyles}
              />
            </div>
            <p className={helperStyles}>
              Porcentaje aplicado sobre el precio de costo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <FaCalculator size={11} />
                Precio Final de Venta ($)
              </label>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 border border-cyan-500/20">
                Calculado
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className="w-full rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-3 text-sm font-bold text-cyan-400 font-mono focus:outline-none cursor-default"
            />
            <p className={helperStyles}>
              Calculado automáticamente: Costo + (Costo × Margen / 100).
            </p>
          </div>

          <div>
            <label className={labelStyles}>
              Descuento de Oferta (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register("discount", {
                  valueAsNumber: true,
                })}
                placeholder="0"
                className={inputStyles}
              />
            </div>
            <p className={helperStyles}>
              Porcentaje de rebaja visible en la tienda.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 3: INVENTARIO Y ESPECIFICACIONES
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaBox size={14} />
          Inventario y Logística
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

          <div>
            <label className={labelStyles}>
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("weight", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Garantía (meses)
            </label>
            <input
              type="number"
              {...register("warranty_months", {
                valueAsNumber: true,
              })}
              placeholder="Meses"
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 4: MULTIMEDIA E IMAGEN
      ====================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
          <FaImage size={14} />
          Imagen del Producto
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-5">
          <ImageUploader
            imageUrl={imageUrl || ""}
            onImageChange={handleFileChange}
          />

          <div className="border-t border-slate-800/80 pt-4">
            <label className={labelStyles}>
              O introducir URL externa directa
            </label>
            <input
              {...register("image")}
              placeholder="https://images.unsplash.com/..."
              className={inputStyles}
            />
            <p className={helperStyles}>
              Si subes un archivo desde la PC, éste tendrá prioridad sobre la URL.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          SECCIÓN 5: VISIBILIDAD Y ESTADO
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
          BOTONES DE ACCIÓN
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
              <span>Crear Producto</span>
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
