import Image from "next/image";

interface ProductItem {
  id: number;
  name: string;
  image?: string | string[] | null;
  price: number;
  quantity: number;
}

interface Props {
  products: ProductItem[];
}

export default function OrderProductsTable({
  products,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">

          <thead className="bg-slate-950/90 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4 text-left">
                Imagen
              </th>

              <th className="p-4 text-left">
                Producto
              </th>

              <th className="p-4 text-center">
                Precio
              </th>

              <th className="p-4 text-center">
                Cantidad
              </th>

              <th className="p-4 text-center">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">

            {products.map((product) => {

              /*
               * La imagen puede venir como:
               * - string
               * - array de strings
               * - null / undefined
               */
              const imageSrc =
                Array.isArray(product.image)
                  ? product.image[0] || "/no-image.png"
                  : typeof product.image === "string" &&
                    product.image.trim() !== ""
                  ? product.image
                  : "/no-image.png";

              const price = Number(product.price) || 0;
              const quantity = Number(product.quantity) || 0;
              const subtotal = price * quantity;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-900/40 transition-colors"
                >

                  {/* IMAGEN */}
                  <td className="p-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center">

                      <Image
                        src={imageSrc}
                        alt={product.name || "Producto"}
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                        unoptimized
                      />

                    </div>
                  </td>

                  {/* PRODUCTO */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {product.name || "Producto sin nombre"}
                    </div>
                  </td>

                  {/* PRECIO */}
                  <td className="p-4 text-center font-mono text-slate-400">
                    ${price.toFixed(2)}
                  </td>

                  {/* CANTIDAD */}
                  <td className="p-4 text-center">
                    <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono font-bold text-slate-300">
                      {quantity}
                    </span>
                  </td>

                  {/* SUBTOTAL */}
                  <td className="p-4 text-center font-mono font-bold text-cyan-400">
                    ${subtotal.toFixed(2)}
                  </td>

                </tr>
              );
            })}

            {(!products || products.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center font-mono text-xs text-slate-500"
                >
                  No hay productos registrados en este pedido.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}