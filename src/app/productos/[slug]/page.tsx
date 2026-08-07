import Link from "next/link";

import {
  getProductBySlug
} from "@/services/productService";



interface Props {

  params: Promise<{

    slug:string;

  }>;

}




export default async function ProductPage({

  params

}:Props){



  const {slug}= await params;



  const product = await getProductBySlug(slug);





  if(!product){


    return (

      <div className="p-10">


        <h1 className="text-3xl font-bold">

          Producto no encontrado

        </h1>


      </div>

    );


  }







  const finalPrice =

    product.discount > 0

    ?

    product.price -

    (product.price * product.discount / 100)

    :

    product.price;







return (

<div className="max-w-6xl mx-auto p-8">





<div className="grid md:grid-cols-2 gap-10">





<div>


{

product.image ? (


<img

src={product.image}

alt={product.name}

className="w-full rounded-xl shadow"

/>


):(


<div className="h-96 bg-gray-200 flex items-center justify-center rounded-xl">

Sin imagen

</div>


)

}


</div>









<div>


<h1 className="text-4xl font-bold mb-4">

{product.name}

</h1>





<p className="text-gray-500 mb-2">

Marca:

<strong>

 {product.brand}

</strong>


</p>





<p className="text-gray-500 mb-5">

Categoría:

<strong>

 {product.category}

</strong>


</p>








{

product.discount > 0 && (


<p className="text-gray-400 line-through text-xl">

${product.price}

</p>


)

}






<p className="text-4xl font-bold text-cyan-600 mb-5">

${finalPrice}

</p>








<p className="mb-4">


{product.description}


</p>








<div className="space-y-2 mb-6">


<p>

Stock disponible:

<strong>

 {product.stock}

</strong>

</p>



<p>

SKU:

<strong>

 {product.sku}

</strong>

</p>




<p>

Peso:

<strong>

 {product.weight} Kg

</strong>

</p>



</div>







<Link

href="https://wa.me/+584264433849"

className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block"

>

Consultar por WhatsApp

</Link>





</div>



</div>





</div>

);


}