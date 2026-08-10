import type { Metadata } from "next";

import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import { CartProvider } from "@/context/CartContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";



const inter = Inter({
  subsets:["latin"],
  variable:"--font-sans"
});



const geistSans = Geist({

  variable:"--font-geist-sans",

  subsets:["latin"],

});



const geistMono = Geist_Mono({

  variable:"--font-geist-mono",

  subsets:["latin"],

});





export const metadata: Metadata = {

  title:"Mundo Web",

  description:"Tienda de tecnología",

};






export default function RootLayout({

children

}: LayoutProps<"/">) {


return (


<html

lang="es"

className={cn(

"h-full",

"antialiased",

geistSans.variable,

geistMono.variable,

"font-sans",

inter.variable

)}

>


<body className="min-h-full flex flex-col">


<CartProvider>
  <StoreSettingsProvider>
    {children}
  </StoreSettingsProvider>
</CartProvider>



<Toaster />



</body>


</html>


);


}