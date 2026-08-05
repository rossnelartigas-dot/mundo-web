import { getProducts } from "@/services/productService";
import { ShoppingCart, Heart, Star } from "lucide-react";

export default async function FeaturedProducts() {

  const products = await getProducts();

  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      <h2 className="text-3xl font-bold mb-10">
        Productos Destacados
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >

            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">

              <div className="flex justify-between">
                <div className="flex">
                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <Heart size={20}/>
              </div>


              <h3 className="font-bold text-lg mt-3">
                {product.name}
              </h3>


              <p className="text-slate-500 text-sm mt-2">
                {product.brand}
              </p>


              <p className="text-cyan-600 font-bold text-2xl mt-3">
                ${product.price}
              </p>


              <button className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl flex justify-center items-center gap-2">
                <ShoppingCart size={20}/>
                Agregar al carrito
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}