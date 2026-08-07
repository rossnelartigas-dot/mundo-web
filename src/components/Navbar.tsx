"use client";


import Link from "next/link";

import {
  FaShoppingCart,
  FaUser,
  FaSearch
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";



export default function Navbar() {


const { cart } = useCart();



const cartCount = cart.reduce(

(total,item)=>

total + item.quantity,

0

);





return (


<header className="w-full bg-white shadow">


<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">





<Link href="/">


<h1 className="text-3xl font-bold text-cyan-400">

Mundo Web

</h1>


</Link>






<div className="hidden md:flex gap-8 font-medium">


<Link href="/">

Inicio

</Link>



<Link href="/productos">

Productos

</Link>



<Link href="/categorias">

Categorías

</Link>



<Link href="/ofertas">

Ofertas

</Link>



<Link href="/contacto">

Contacto

</Link>


</div>







<div className="flex items-center gap-5 text-xl">





<FaSearch

className="cursor-pointer hover:text-cyan-400"

/>







<Link

href="/carrito"

className="relative"

>


<FaShoppingCart

className="cursor-pointer hover:text-cyan-400"

/>




{

cartCount > 0 && (


<span

className="absolute -top-3 -right-3 bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"

>


{cartCount}


</span>


)


}



</Link>







<FaUser

className="cursor-pointer hover:text-cyan-400"

/>






</div>






</div>


</header>


);


}