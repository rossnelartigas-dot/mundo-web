"use client";


import Image from "next/image";

import Link from "next/link";

import { useCart } from "@/context/CartContext";





export default function CartPage(){


const {

cart,

removeFromCart,

increaseQuantity,

decreaseQuantity,

total

} = useCart();







if(cart.length === 0){


return (


<div className="max-w-5xl mx-auto p-8">


<h1 className="text-3xl font-bold mb-5">

Carrito vacío

</h1>


<p className="mb-5">

No tienes productos agregados.

</p>



<Link

href="/"

className="bg-cyan-500 text-white px-6 py-3 rounded-lg"

>


Volver a comprar


</Link>


</div>


);


}







return (


<div className="max-w-6xl mx-auto p-8">


<h1 className="text-3xl font-bold mb-8">

Carrito de compras

</h1>






<div className="space-y-5">





{

cart.map((product)=>(



<div

key={product.id}

className="bg-white shadow rounded-xl p-5 flex gap-5 items-center"

>






{

product.image && (


<img

src={product.image}

alt={product.name}

className="w-28 h-28 object-cover rounded-lg"

/>


)


}








<div className="flex-1">


<h2 className="font-bold text-xl">

{product.name}

</h2>



<p className="text-gray-500">

{product.brand}

</p>





<p className="text-cyan-600 font-bold text-lg">

${product.price}

</p>



</div>









<div className="flex items-center gap-3">



<button

onClick={()=>decreaseQuantity(product.id)}

className="bg-gray-200 px-3 py-1 rounded"

>

-

</button>





<span className="font-bold">

{product.quantity}

</span>





<button

onClick={()=>increaseQuantity(product.id)}

className="bg-gray-200 px-3 py-1 rounded"

>

+

</button>




</div>







<button

onClick={()=>removeFromCart(product.id)}

className="bg-red-500 text-white px-4 py-2 rounded-lg"

>


Eliminar


</button>







</div>



))


}





</div>








<div className="mt-10 bg-slate-100 p-6 rounded-xl">


<h2 className="text-2xl font-bold">

Total:

<span className="text-cyan-600">

${total}

</span>


</h2>





<button

className="mt-5 bg-cyan-600 text-white px-8 py-3 rounded-lg"

>


Continuar compra


</button>



</div>





</div>


);


}