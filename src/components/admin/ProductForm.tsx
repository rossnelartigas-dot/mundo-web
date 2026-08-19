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
  // Usamos image_url como respaldo por compatibilidad
  // con productos existentes.
  const initialImage = product?.image || product?.image_url || "";

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as Resolver<
      ProductFormData,
      unknown
    >,

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

    nameRegister.onChange(e);

    if (!product) {
      setValue("slug", generateSlug(value));
    }
  }

  async function onSubmit(data: ProductFormData): Promise<void> {
    try {
      setLoading(true);

      let imageUrl = data.image || "";

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
        slug:
          data.slug?.trim() || generateSlug(data.name),

        image: normalizedImageUrl,
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

    if (!file) {
      setValue("image", "");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-full
        max-w-5xl
        space-y-8
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        p-5
        shadow-2xl
        backdrop-blur-md
        sm:p-6
        lg:p-8
      "
    >
      {/* CABECERA */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.7)]" />

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>

            <p className="mt-1 text-[11px] font-mono text-slate-500">
              {product
                ? "Actualiza la información del producto en el inventario."
                : "Registra un nuevo producto en el inventario."}
            </p>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN PRINCIPAL */}
      <section className="space-y-5">
        <div>
          <p className="mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
            Información principal
          </p>

          {/* NOMBRE */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Nombre del Producto *
            </label>

            <input
              {...nameRegister}
              onChange={handleNameChange}
              placeholder="Ej: Laptop Dell XPS 13"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />

            {errors.name && (
              <p className="mt-1.5 text-xs font-mono text-rose-400">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
            Descripción
          </label>

          <textarea
            {...register("description")}
            rows={5}
            placeholder="Detalles sobre las especificaciones del producto..."
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              px-4
              py-3
              text-sm
              leading-relaxed
              text-slate-100
              placeholder-slate-600
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-1
              focus:ring-cyan-500
            "
          />
        </div>
      </section>

      {/* CLASIFICACIÓN */}
      <section className="space-y-4">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Clasificación
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* MARCA */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Marca
            </label>

            <input
              {...register("brand")}
              placeholder="Ej: Dell, ASUS"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-3.5
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Categoría
            </label>

            <input
              {...register("category")}
              placeholder="Ej: Computación"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-3.5
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* SUBCATEGORÍA */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Subcategoría
            </label>

            <input
              {...register("subcategory")}
              placeholder="Ej: Laptops"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-3.5
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* CONDICIÓN */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Condición
            </label>

            <select
              {...register("condition")}
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-3.5
                py-3
                text-sm
                text-slate-100
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="reacondicionado">
                Reacondicionado
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section
        className="
          space-y-4
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/60
          p-5
        "
      >
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
            Precios y rentabilidad
          </p>

          <p className="mt-1 text-[10px] font-mono text-slate-600">
            Configura costos, margen y precio de venta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* COSTO */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Costo ($)
            </label>

            <input
              type="number"
              step="0.01"
              {...register("cost_price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* MARGEN */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Margen Ganancia (%)
            </label>

            <input
              type="number"
              step="0.01"
              {...register("profit_margin", {
                valueAsNumber: true,
              })}
              placeholder="30"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* PRECIO */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Precio de Venta ($) *
            </label>

            <input
              type="number"
              step="0.01"
              {...register("price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className="
                w-full
                rounded-xl
                border
                border-emerald-500/30
                bg-slate-900
                px-4
                py-3
                text-sm
                font-semibold
                text-emerald-400
                placeholder-slate-600
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-1
                focus:ring-emerald-400
              "
            />

            {errors.price && (
              <p className="mt-1.5 text-xs font-mono text-rose-400">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* INVENTARIO */}
      <section className="space-y-4">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Inventario y condiciones
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* STOCK */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Stock *
            </label>

            <input
              type="number"
              {...register("stock", {
                valueAsNumber: true,
              })}
              placeholder="0"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />

            {errors.stock && (
              <p className="mt-1.5 text-xs font-mono text-rose-400">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* DESCUENTO */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Descuento (%)
            </label>

            <input
              type="number"
              step="0.01"
              {...register("discount", {
                valueAsNumber: true,
              })}
              placeholder="0"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* PESO */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Peso (Kg)
            </label>

            <input
              type="number"
              step="0.01"
              {...register("weight", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>

          {/* GARANTÍA */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Garantía (Meses)
            </label>

            <input
              type="number"
              {...register("warranty_months", {
                valueAsNumber: true,
              })}
              placeholder="0"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />
          </div>
        </div>
      </section>

      {/* SKU Y SLUG */}
      <section className="space-y-4">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Identificación
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* SKU */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              SKU (Código único)
            </label>

            <input
              {...register("sku")}
              placeholder="Ej: LAP-DELL-001"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />

            {errors.sku && (
              <p className="mt-1.5 text-xs font-mono text-rose-400">
                {errors.sku.message}
              </p>
            )}
          </div>

          {/* SLUG */}
          <div>
            <label className="mb-2 block text-xs font-mono font-semibold text-slate-300">
              Slug URL
            </label>

            <input
              {...register("slug")}
              placeholder="ej-laptop-dell-xps-13"
              className="
                w-full
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                py-3
                text-sm
                text-slate-100
                placeholder-slate-600
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-1
                focus:ring-cyan-500
              "
            />

            {errors.slug && (
              <p className="mt-1.5 text-xs font-mono text-rose-400">
                {errors.slug.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* IMAGEN */}
      <section
        className="
          space-y-4
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/60
          p-5
        "
      >
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
            Imagen del producto
          </p>

          <p className="mt-1 text-[10px] font-mono text-slate-600">
            Puedes subir una imagen desde tu PC o utilizar una URL.
          </p>
        </div>

        <ImageUploader
          imageUrl={initialImage}
          onImageChange={handleFileChange}
        />

        <div className="border-t border-slate-800 pt-4">
          <label className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            URL de imagen
          </label>

          <input
            {...register("image")}
            placeholder="https://imagen.com/producto.jpg"
            className="
              w-full
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              px-4
              py-3
              text-sm
              text-slate-100
              placeholder-slate-600
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-1
              focus:ring-cyan-500
            "
          />
        </div>
      </section>

      {/* PUBLICACIÓN */}
      <section className="space-y-4 border-t border-slate-800 pt-5">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
          Estado de publicación
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              px-4
              py-3
              transition
              hover:border-cyan-500/40
            "
          >
            <input
              type="checkbox"
              {...register("featured")}
              className="
                h-4
                w-4
                rounded
                border-slate-700
                bg-slate-950
                text-cyan-500
                focus:ring-cyan-500
              "
            />

            <span className="text-xs font-mono font-medium text-slate-300">
              Producto destacado
            </span>
          </label>

          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              px-4
              py-3
              transition
              hover:border-emerald-500/40
            "
          >
            <input
              type="checkbox"
              {...register("active")}
              className="
                h-4
                w-4
                rounded
                border-slate-700
                bg-slate-950
                text-emerald-500
                focus:ring-emerald-500
              "
            />

            <span className="text-xs font-mono font-medium text-slate-300">
              Producto activo en tienda
            </span>
          </label>
        </div>
      </section>

      {/* BOTONES */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="
            w-full
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            px-6
            py-3
            font-mono
            text-xs
            font-bold
            text-slate-400
            transition
            hover:border-slate-700
            hover:bg-slate-800
            hover:text-white
            sm:w-auto
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            border
            border-cyan-400/30
            bg-cyan-500
            px-7
            py-3
            font-mono
            text-xs
            font-bold
            text-slate-950
            shadow-[0_0_20px_rgba(6,182,212,0.2)]
            transition
            hover:bg-cyan-400
            hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          {loading
            ? "Guardando..."
            : product
              ? "Guardar cambios"
              : "Crear producto"}
        </button>
      </div>
    </form>
  );
}