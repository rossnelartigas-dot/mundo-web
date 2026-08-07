"use client";


import { useState } from "react";

import { useCart } from "@/context/CartContext";

import { createOrder } from "@/services/orderService";

import { useRouter } from "next/navigation";




export default function CheckoutPage(){



const router = useRouter();


const {

cart,

total,

clearCart

}=useCart();





const [loading,setLoading]=useState(false);





const [form,setForm]=useState({

customer_name:"",

customer_phone:"",

customer_email:"",

customer_address:""

});








function handleChange(

e:React.ChangeEvent<HTMLInputElement>

){


setForm({

...form,

[e.target.name]:e.target.value

});


}







async function handleSubmit(){


try{


setLoading(true);



await createOrder({


...form,


products:cart,


total



});





alert(

"Pedido creado correctamente"

);





clearCart();


router.push("/");





}catch(error){


console.error(error);


alert(

"Error creando pedido"

);



}finally{


setLoading(false);


}



}







return (


<div className="max-w-xl mx-auto p-8">



<h1 className="text-3xl font-bold mb-8">

Finalizar compra

</h1>






<div className="space-y-5">





<input

name="customer_name"

placeholder="Nombre completo"

onChange={handleChange}

className="border p-3 rounded w-full"

/>





<input

name="customer_phone"

placeholder="Teléfono"

onChange={handleChange}

className="border p-3 rounded w-full"

/>





<input

name="customer_email"

placeholder="Correo"

onChange={handleChange}

className="border p-3 rounded w-full"

/>





<input

name="customer_address"

placeholder="Dirección"

onChange={handleChange}

className="border p-3 rounded w-full"

/>







<div className="bg-slate-100 p-5 rounded-xl">


<h2 className="text-xl font-bold">

Total:

${total}

</h2>


</div>







<button

onClick={handleSubmit}

disabled={loading}

className="bg-cyan-600 text-white px-8 py-3 rounded-lg w-full"

>


{

loading

?

"Procesando..."

:

"Confirmar pedido"

}



</button>






</div>


</div>


);


}