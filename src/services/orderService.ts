import { supabase } from "@/lib/supabase";



export interface OrderData {

  customer_name:string;

  customer_phone:string;

  customer_email:string;

  customer_address:string;

  products:any[];

  total:number;

}






export async function createOrder(

order:OrderData

){



const {

data,

error

}=await supabase

.from("orders")

.insert({

customer_name:order.customer_name,

customer_phone:order.customer_phone,

customer_email:order.customer_email,

customer_address:order.customer_address,

products:order.products,

total:order.total,

status:"pending"

})

.select()

.single();





if(error){

throw error;

}




return data;



}