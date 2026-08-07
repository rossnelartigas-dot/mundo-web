"use client";

import { deleteProduct } from "@/services/productService";

import { useRouter } from "next/navigation";



interface Props {

  id:number;

}



export default function DeleteButton({

  id

}:Props){


  const router = useRouter();




  async function handleDelete(){


    const confirmDelete = confirm(

      "¿Seguro que deseas eliminar este producto?"

    );


    if(!confirmDelete) return;




    try{


      await deleteProduct(id);



      router.refresh();



    }catch(error){


      console.error(error);


      alert(

        "Error eliminando producto"

      );


    }


  }






  return (

    <button

      onClick={handleDelete}

      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"

    >

      Eliminar

    </button>

  );


}