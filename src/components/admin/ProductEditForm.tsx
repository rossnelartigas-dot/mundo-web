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

  image?: string;

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



  const {
    register,
    setValue: _setValue,
    handleSubmit,
    control,
  } = useForm<ProductEditFormData>({

    defaultValues: {

      name: product.name,

      description:
        product.description,

      brand: product.brand,

      category: product.category,

      price: product.price,

      stock: product.stock,

      image:
        product.image || "",

      featured:
        product.featured || false,

      active:
        product.active ?? true,

    },

  });



  const onSubmit: SubmitHandler<ProductEditFormData> =
    async (data) => {


      try {


        setLoading(true);


        let imageUrl =
          data.image || "";


        if (imageFile) {

          imageUrl =
            await uploadProductImage(
              imageFile
            );

        }


        await updateProduct(

          product.id,

          {

            ...data,

            image: imageUrl,

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



  const handleFileChange = (e: unknown) => {
    const ev = e as React.ChangeEvent<HTMLInputElement>;
    const files = ev?.target?.files;
    if (!files || files.length === 0) return;
    setImageFile(files[0]);
  };

  return (

    <form

      onSubmit={
        handleSubmit(onSubmit)
      }

      className="space-y-6"

    >


      <div>

        <label className="block mb-2 font-medium">

          Nombre

        </label>


        <input

          {...register("name")}

          className="border rounded-lg p-3 w-full"

        />

      </div>




      <div>

        <label className="block mb-2 font-medium">

          Descripción

        </label>


        <textarea

          {...register("description")}

          rows={4}

          className="border rounded-lg p-3 w-full"

        />

      </div>




      <div className="grid grid-cols-2 gap-5">

        <input

          {...register("brand")}

          placeholder="Marca"

          className="border rounded-lg p-3"

        />


        <input

          {...register("category")}

          placeholder="Categoría"

          className="border rounded-lg p-3"

        />

      </div>




      <div className="grid grid-cols-2 gap-5">

        <input

          type="number"

          {...register("price", {
            valueAsNumber: true,
          })}

          placeholder="Precio"

          className="border rounded-lg p-3"

        />


        <input

          type="number"

          {...register("stock", {
            valueAsNumber: true,
          })}

          placeholder="Stock"

          className="border rounded-lg p-3"

        />

      </div>




      <div>

        <ImageUploader

          imageUrl={product.image}

          onImageChange={handleFileChange}

        />

      </div>




      <div>

        <label className="block mb-2 font-medium">

          URL de imagen

        </label>


        <input

          {...register("image")}

          className="border rounded-lg p-3 w-full"

          placeholder="https://..."

        />

      </div>




      <div className="flex items-center gap-3">

        <input

          type="checkbox"

          {...register("featured")}

        />


        <label>

          Producto destacado

        </label>

      </div>




      <div className="flex items-center gap-3">

        <input

          type="checkbox"

          {...register("active")}

        />


        <label>

          Producto activo

        </label>

      </div>




      <div className="flex gap-4">

        <button

          type="submit"

          disabled={loading}

          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"

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

          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"

        >

          Cancelar

        </button>

      </div>


    </form>

  );

}