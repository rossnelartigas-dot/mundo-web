import Link from "next/link";

import { getProducts } from "@/services/productService";

import {
  ShoppingCart,
  Heart,
  Star
} from "lucide-react";


export default async function FeaturedProducts() {


  const products = await getProducts();


  const featuredProducts = products.filter(
    (product) => product.featured
  );



  return (


<section>



<h2 className="text-3xl font-bold mb-10">

Productos Destacados

</h2>





<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">


{

featuredProducts.map((product)=>(



<div

key={product.id}

className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"

>




<Link

href={`/productos/${product.slug}`}

>


{

product.image ? (

<img

src={product.image}

alt={product.name}

className="h-56 w-full object-cover"

/>


):(


<div className="h-56 w-full bg-gray-200 flex items-center justify-center">

Sin imagen

</div>


)


}



</Link>






<div className="p-5">





<div className="flex justify-between">


<div className="flex">


{

[1,2,3,4,5].map((star)=>(


<Star

key={star}

size={18}

className="fill-yellow-400 text-yellow-400"

/>


))


}


</div>





<Heart size={20}/>



</div>







<Link

href={`/productos/${product.slug}`}

>


<h3 className="font-bold text-lg mt-3 hover:text-cyan-600">

{product.name}

</h3>


</Link>






<p className="text-slate-500 text-sm mt-2">

{product.brand}

</p>







{

product.discount > 0 && (


<p className="text-sm text-gray-400 line-through mt-2">

${product.price}

</p>


)

}






<p className="text-cyan-600 font-bold text-2xl mt-3">


$

{

product.discount > 0

?

product.price -

(product.price * product.discount / 100)

:

product.price

}



</p>







<button

className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"

>


<ShoppingCart size={20}/>


Agregar al carrito


</button>






</div>





</div>



))

}



</div>



</section>


  );

}