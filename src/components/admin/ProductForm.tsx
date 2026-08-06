"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  ProductSchema,
  ProductFormData,
} from "@/lib/validators/product";

import { createProduct } from "@/services/productService";
import { uploadProductImage } from "@/services/storageService";

import ImageUploader from "./ImageUploader";


export default function ProductForm() {

  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState:{errors}

  } = useForm<ProductFormData>({

    resolver:zodResolver(ProductSchema),

    defaultValues:{
      featured:false,
      active:true,
      image:""
    }

  });



  async function onSubmit(data:ProductFormData){

    try{

      setLoading(true);


      let imageUrl = data.image || "";


      if(imageFile){

        imageUrl = await uploadProductImage(imageFile);

      }



      await createProduct({

        ...data,

        image:imageUrl

      });



      alert("Producto creado correctamente");


      reset();

      setImageFile(null);


      router.push("/admin/products");

      router.refresh();


    }catch(error){

      console.error(
        "Error creando producto:",
        error
      );

      alert("Error creando producto");


    }finally{

      setLoading(false);

    }

  }



  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
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

        <p className="text-red-500">
          {errors.name?.message}
        </p>

      </div>



      <div>

        <label className="block mb-2 font-medium">
          Descripción
        </label>


        <textarea

          {...register("description")}

          className="border rounded-lg p-3 w-full"

          rows={4}

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

          {...register("price")}

          placeholder="Precio"

          className="border rounded-lg p-3"

        />


        <input

          type="number"

          {...register("stock")}

          placeholder="Stock"

          className="border rounded-lg p-3"

        />


      </div>




      <div>

        <ImageUploader

          onImageChange={(file)=>{

            setImageFile(file);

          }}

        />

      </div>




      <div>

        <label className="block mb-2 font-medium">

          O usar URL de imagen

        </label>


        <input

          {...register("image")}

          placeholder="https://imagen.com/producto.jpg"

          className="border rounded-lg p-3 w-full"

        />

      </div>




      <div className="flex gap-3 items-center">

        <input

          type="checkbox"

          {...register("featured")}

        />

        <span>
          Producto destacado
        </span>


      </div>




      <div className="flex gap-3 items-center">

        <input

          type="checkbox"

          {...register("active")}

        />

        <span>
          Producto activo
        </span>


      </div>




      <button

        disabled={loading}

        className="bg-cyan-600 text-white px-6 py-3 rounded-lg"

      >

        {loading
          ? "Guardando..."
          : "Guardar Producto"
        }


      </button>


    </form>

  );

}