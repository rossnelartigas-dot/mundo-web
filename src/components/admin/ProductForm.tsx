"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  ProductSchema,
  ProductFormData,
} from "@/lib/validators/product";

import { createProduct } from "@/services/productService";


export default function ProductForm() {

  const router = useRouter();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }

  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as any,

    defaultValues: {

      name: "",
      description: "",
      brand: "",
      category: "",
      price: 0,
      stock: 0,
      featured: false,
      active: true,
      image: ""

    }

  });



  async function onSubmit(data: ProductFormData) {

    try {

      await createProduct({

        ...data,

        image: data.image || ""

      });


      alert("Producto creado correctamente");


      reset();


      router.push("/admin/products");


    } catch (error) {


      console.error(
        "Error creando producto:",
        error
      );


      alert("Error guardando producto");


    }

  }



  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >


      <div>

        <label className="block font-medium mb-2">
          Nombre del producto
        </label>


        <input

          {...register("name")}

          className="border rounded-lg w-full p-3"

          placeholder="Ejemplo: Laptop Lenovo"

        />


        <p className="text-red-500 text-sm">
          {errors.name?.message}
        </p>


      </div>



      <div>

        <label className="block font-medium mb-2">
          Descripción
        </label>


        <textarea

          {...register("description")}

          className="border rounded-lg w-full p-3"

          rows={4}

          placeholder="Descripción del producto"

        />


        <p className="text-red-500 text-sm">
          {errors.description?.message}
        </p>


      </div>




      <div className="grid grid-cols-2 gap-5">


        <div>

          <label className="block mb-2">
            Marca
          </label>


          <input

            {...register("brand")}

            className="border rounded-lg w-full p-3"

            placeholder="Ejemplo: Lenovo"

          />


        </div>




        <div>

          <label className="block mb-2">
            Categoría
          </label>


          <input

            {...register("category")}

            className="border rounded-lg w-full p-3"

            placeholder="Ejemplo: Laptops"

          />


        </div>


      </div>





      <div className="grid grid-cols-2 gap-5">


        <div>

          <label className="block mb-2">
            Precio
          </label>


          <input

            type="number"

            {...register("price")}

            className="border rounded-lg w-full p-3"

            placeholder="599"

          />


        </div>




        <div>

          <label className="block mb-2">
            Stock
          </label>


          <input

            type="number"

            {...register("stock")}

            className="border rounded-lg w-full p-3"

            placeholder="10"

          />


        </div>


      </div>





      <div>

        <label className="block mb-2">
          Imagen URL
        </label>


        <input

          {...register("image")}

          className="border rounded-lg w-full p-3"

          placeholder="https://imagen.com/foto.jpg"

        />


      </div>





      <div className="flex gap-6">


        <label className="flex items-center gap-2">

          <input

            type="checkbox"

            {...register("featured")}

          />

          Producto destacado

        </label>





        <label className="flex items-center gap-2">

          <input

            type="checkbox"

            {...register("active")}

          />

          Producto activo

        </label>


      </div>





      <button

        type="submit"

        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"

      >

        Guardar Producto

      </button>



    </form>

  );

}