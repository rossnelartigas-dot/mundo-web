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


export default function ProductForm({
  product
}: Props) {


  const router = useRouter();


  const [imageFile, setImageFile] = useState<File | null>(null);


  const [loading, setLoading] = useState(false);



  const { register, setValue: _setValue, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as Resolver<ProductFormData, unknown>,
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      brand: product?.brand || "",
      image: product?.image || "",
      stock: product?.stock || 0,
      slug: product?.slug || "",
      sku: product?.sku || "",
      featured: product?.featured ?? false,
      active: product?.active ?? true,
      discount: product?.discount || 0,
      weight: product?.weight || 0,
    },
  });


  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    _setValue("name", value);
    if (!product) {
      _setValue("slug", generateSlug(value));
    }
  }

  async function onSubmit(data: ProductFormData): Promise<void> {
    try {
      setLoading(true);
      let imageUrl = data.image || "";
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }
      const productData = {
        ...data,
        image: imageUrl,
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

  const handleFileChange = (e: unknown) => {
    const ev = e as React.ChangeEvent<HTMLInputElement>;
    const files = ev?.target?.files;
    if (!files || files.length === 0) return;
    setImageFile(files[0]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">Nombre</label>
        <input
          {...register("name")}
          onChange={handleNameChange}
          className="border p-3 w-full rounded-lg"
        />
        <p className="text-red-500">{errors.name?.message}</p>
      </div>
      <div>
        <label className="block mb-2 font-medium">Descripción</label>
        <textarea
          {...register("description")}
          rows={4}
          className="border p-3 w-full rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          {...register("brand")}
          placeholder="Marca"
          className="border p-3 rounded-lg"
        />
        <input
          {...register("category")}
          placeholder="Categoría"
          className="border p-3 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          {...register("price", {
            valueAsNumber: true,
          })}
          placeholder="Precio"
          className="border p-3 rounded-lg"
        />
        <input
          type="number"
          {...register("stock", {
            valueAsNumber: true,
          })}
          placeholder="Stock"
          className="border p-3 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          {...register("sku")}
          placeholder="SKU"
          className="border p-3 rounded-lg"
        />
        <input
          {...register("slug")}
          placeholder="Slug"
          className="border p-3 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          {...register("discount", {
            valueAsNumber: true,
          })}
          placeholder="Descuento %"
          className="border p-3 rounded-lg"
        />
        <input
          type="number"
          {...register("weight", {
            valueAsNumber: true,
          })}
          placeholder="Peso Kg"
          className="border p-3 rounded-lg"
        />
      </div>
      <ImageUploader
        imageUrl={product?.image}
        onImageChange={handleFileChange}
      />
      <div>
        <label className="block mb-2 font-medium">URL de imagen</label>
        <input
          {...register("image")}
          placeholder="https://imagen.com/producto.jpg"
          className="border p-3 w-full rounded-lg"
        />
      </div>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          {...register("featured")}
        />
        Producto destacado
      </label>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          {...register("active")}
        />
        Producto activo
      </label>
      <div className="flex gap-4">
        <button
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}