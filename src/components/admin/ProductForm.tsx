"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

import { uploadProductImage } from "@/services/storageService";

import { Product } from "@/types/product";

import ImageUploader from "./ImageUploader";


interface Props {
  product?: Product;
}


export default function ProductForm({ product }: Props) {


  const router = useRouter();


  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);



  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState:{
      errors
    }

  } = useForm<ProductFormData>({

    resolver: zodResolver(ProductSchema),

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

      featured: product?.featured || false,

      active: product?.active ?? true,

      discount: product?.discount || 0,

      weight: product?.weight || 0,

    }

  });



  const name = watch("name");



  function generateSlug(value:string){

    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g,"")
      .replace(/\s+/g,"-");

  }



  function handleNameChange(
    e:React.ChangeEvent<HTMLInputElement>
  ){

    setValue(
      "name",
      e.target.value
    );


    if(!product){

      setValue(
        "slug",
        generateSlug(e.target.value)
      );

    }

  }




  async function onSubmit(data:ProductFormData){


    try {


      setLoading(true);



      let imageUrl = data.image || "";



      if(imageFile){

        imageUrl = await uploadProductImage(imageFile);

      }




      const productData = {

        ...data,

        image:imageUrl

      };




      if(product){


        await updateProduct(

          product.id,

          productData

        );


        alert(
          "Producto actualizado"
        );


      }else{


        await createProduct(

          productData

        );


        alert(
          "Producto creado"
        );


      }




      router.push(
        "/admin/products"
      );


      router.refresh();



    } catch(error){


      console.error(error);


      alert(
        "Error guardando producto"
      );


    } finally {


      setLoading(false);


    }


  }




  return (

    <form

      onSubmit={
        handleSubmit(onSubmit)
      }

      className="space-y-6"

    >


      <div>

        <label>
          Nombre
        </label>


        <input

          defaultValue={product?.name}

          onChange={handleNameChange}

          className="border p-3 w-full rounded"

        />


        <input

          type="hidden"

          {...register("name")}

        />


        <p className="text-red-500">
          {errors.name?.message}
        </p>


      </div>



      <div>

        <label>
          Descripción
        </label>


        <textarea

          {...register("description")}

          className="border p-3 w-full rounded"

        />

      </div>




      <div className="grid grid-cols-2 gap-4">


        <input

          {...register("brand")}

          placeholder="Marca"

          className="border p-3 rounded"

        />



        <input

          {...register("category")}

          placeholder="Categoría"

          className="border p-3 rounded"

        />


      </div>




      <div className="grid grid-cols-2 gap-4">


        <input

          type="number"

          {...register("price")}

          placeholder="Precio"

          className="border p-3 rounded"

        />



        <input

          type="number"

          {...register("stock")}

          placeholder="Stock"

          className="border p-3 rounded"

        />


      </div>




      <div className="grid grid-cols-2 gap-4">


        <input

          {...register("sku")}

          placeholder="SKU"

          className="border p-3 rounded"

        />


      </div>




      <div className="grid grid-cols-2 gap-4">


        <input

          type="number"

          {...register("discount")}

          placeholder="Descuento %"

          className="border p-3 rounded"

        />



        <input

          type="number"

          {...register("weight")}

          placeholder="Peso Kg"

          className="border p-3 rounded"

        />


      </div>




      <ImageUploader

        imageUrl={product?.image}

        onImageChange={
          setImageFile
        }

      />




      <input

        {...register("image")}

        placeholder="URL de imagen"

        className="border p-3 w-full rounded"

      />





      <label className="flex gap-2">

        <input

          type="checkbox"

          {...register("featured")}

        />

        Producto destacado

      </label>




      <label className="flex gap-2">

        <input

          type="checkbox"

          {...register("active")}

        />

        Producto activo

      </label>





      <div className="flex gap-4">


        <button

          disabled={loading}

          className="bg-cyan-600 text-white px-6 py-3 rounded"

        >

          {loading
            ? "Guardando..."
            : product
              ? "Guardar cambios"
              : "Crear producto"
          }


        </button>




        <button

          type="button"

          onClick={() =>
            router.push("/admin/products")
          }

          className="bg-gray-400 text-white px-6 py-3 rounded"

        >

          Cancelar

        </button>


      </div>



    </form>

  );

}