"use client";

import { useState } from "react";


interface Props {

  onImageChange: (file: File | null) => void;

  imageUrl?: string;

}



export default function ImageUploader({

  onImageChange,

  imageUrl

}: Props) {



  const [preview, setPreview] = useState(

    imageUrl || ""

  );





  function handleFileChange(

    e: React.ChangeEvent<HTMLInputElement>

  ) {


    const file = e.target.files?.[0];



    if (!file) return;




    if (!file.type.startsWith("image/")) {


      alert("Solo se permiten imágenes");


      return;


    }





    if (file.size > 5 * 1024 * 1024) {


      alert("La imagen no puede superar 5MB");


      return;


    }





    setPreview(

      URL.createObjectURL(file)

    );



    onImageChange(file);



  }





  function removeImage(){


    setPreview("");

    onImageChange(null);


  }





  return (


    <div className="space-y-4">


      <div>


        <label className="block font-medium mb-2">

          Subir imagen desde PC

        </label>



        <input


          type="file"


          accept="image/*"


          onChange={handleFileChange}


          className="border p-3 w-full rounded-lg"


        />


      </div>





      {preview && (


        <div className="space-y-3">


          <p className="font-medium">

            Vista previa

          </p>




          <img


            src={preview}


            alt="Vista previa"


            className="w-48 h-48 object-cover rounded-lg border"


          />





          <button


            type="button"


            onClick={removeImage}


            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"


          >


            Eliminar imagen


          </button>



        </div>


      )}


    </div>


  );


}