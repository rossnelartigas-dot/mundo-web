"use client";


import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";


import { Product } from "@/types/product";



interface CartItem extends Product {

  quantity:number;

}



interface CartContextType {


  cart:CartItem[];


  addToCart:(product:Product)=>void;


  removeFromCart:(id:number)=>void;


  increaseQuantity:(id:number)=>void;


  decreaseQuantity:(id:number)=>void;


  clearCart:()=>void;


  total:number;


}





const CartContext = createContext<CartContextType | undefined>(undefined);






export function CartProvider({

children

}:{

children:React.ReactNode

}){



const [cart,setCart] = useState<CartItem[]>([]);






useEffect(()=>{


const savedCart = localStorage.getItem(
"cart"
);



if(savedCart){


setCart(
JSON.parse(savedCart)
);


}


},[]);








useEffect(()=>{


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


},[cart]);








function addToCart(product:Product){



setCart((current)=>{


const exists = current.find(

(item)=>

item.id === product.id

);






if(exists){


return current.map((item)=>

item.id === product.id

?

{

...item,

quantity:item.quantity + 1

}

:

item

);


}







return [

...current,

{

...product,

quantity:1

}

];


});



}










function removeFromCart(id:number){



setCart((current)=>

current.filter(

(item)=>

item.id !== id

)

);



}









function increaseQuantity(id:number){


setCart((current)=>

current.map((item)=>

item.id === id

?

{

...item,

quantity:item.quantity + 1

}

:

item

)


);


}









function decreaseQuantity(id:number){


setCart((current)=>

current.map((item)=>

item.id === id && item.quantity > 1

?

{

...item,

quantity:item.quantity - 1

}

:

item

)


);


}









function clearCart(){


setCart([]);


}








const total = cart.reduce(

(sum,item)=>

sum +

(item.price * item.quantity),

0

);









return (


<CartContext.Provider


value={{


cart,


addToCart,


removeFromCart,


increaseQuantity,


decreaseQuantity,


clearCart,


total


}}



>


{children}


</CartContext.Provider>


);



}









export function useCart(){



const context = useContext(
CartContext
);



if(!context){


throw new Error(

"useCart debe usarse dentro de CartProvider"

);


}



return context;



}