import Link from "next/link";
import Image from 'next/image';

import { getProducts } from "@/services/productService";

import {
  Heart,
  Star
} from "lucide-react";

import AddToCartButton from "./AddToCartButton";

export default async function FeaturedProducts() {
  const products = await getProducts();
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-10">Productos Destacados</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <Link href={`/productos/${product.slug}`}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name ?? 'product'}
                  width={400}
                  height={300}
                  priority={false}
                />
              ) : (
                <div className="w-full h-48 bg-gray-100" />
              )}
            </Link>

            <div className="p-5">
              <div className="flex justify-between items-center">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <Heart size={20} className="cursor-pointer" />
              </div>

              <Link href={`/productos/${product.slug}`}>
                <h3 className="font-bold text-lg mt-3 hover:text-cyan-600">
                  {product.name}
                </h3>
              </Link>

              <p className="text-slate-500 text-sm mt-2">{product.brand}</p>

              {product.discount > 0 && (
                <p className="text-gray-400 line-through mt-3">${product.price}</p>
              )}

              <p className="text-cyan-600 font-bold text-2xl mt-3">
                ${product.discount > 0 ? (product.price - (product.price * product.discount / 100)) : product.price}
              </p>

              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}