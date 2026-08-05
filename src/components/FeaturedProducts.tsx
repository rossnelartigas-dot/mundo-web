"use client";

import { ShoppingCart, Heart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Laptop Lenovo IdeaPad",
    price: 599,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    rating: 5,
  },
  {
    id: 2,
    name: "Monitor LG 27'' Full HD",
    price: 189,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
    rating: 4,
  },
  {
    id: 3,
    name: "Teclado Mecánico RGB",
    price: 59,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
    rating: 5,
  },
  {
    id: 4,
    name: "Mouse Gamer Logitech",
    price: 39,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    rating: 5,
  },
];

export default function FeaturedProducts() {
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

              <div className="flex justify-between items-center mb-3">
                <div className="flex">
                  {Array.from({ length: product.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <Heart
                  size={20}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>

              <h3 className="font-bold text-lg">
                {product.name}
              </h3>

              <p className="text-cyan-600 font-bold text-2xl mt-2">
                ${product.price}
              </p>

              <button
                className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
              >
                <ShoppingCart size={20} />
                Agregar al carrito
              </button>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}