"use client";


import { ShoppingCart } from "lucide-react";

import { Product } from "@/types/product";

import { useCart } from "@/context/CartContext";



interface Props {

  product: Product;

}




export default function AddToCartButton({

product

}:Props){



const { addToCart } = useCart();





function handleAdd(){


addToCart(product);


alert(

"Producto agregado al carrito"

);


}





return (


<button

onClick={handleAdd}

className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"

>


<ShoppingCart size={20}/>


Agregar al carrito



</button>


);


}