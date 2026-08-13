import Image from 'next/image';

interface ProductItem {
  id: number;
  name: string;
  image?: string;
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

      <table className="w-full text-left text-sm text-slate-300">

        <thead className="bg-slate-950/90 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">

          <tr>

            <th className="p-4 text-left">
              Imagen
            </th>

            <th className="text-left py-4">
              Producto
            </th>

            <th className="text-center py-4 font-mono">
              Precio
            </th>

            <th className="text-center py-4 font-mono">
              Cantidad
            </th>

            <th className="text-center py-4 font-mono">
              Subtotal
            </th>

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-800/60">

          {products.map((product) => (

            <tr
              key={product.id}
              className="hover:bg-slate-900/40 transition-colors"
            >

              <td className="p-4">

                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center">
                  <Image
                    src={product.image || '/no-image.png'}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                  />
                </div>

              </td>

              <td className="font-semibold text-slate-100">
                {product.name}
              </td>

              <td className="text-center font-mono text-slate-400">
                $
                {Number(
                  product.price
                ).toFixed(2)}
              </td>

              <td className="text-center font-mono text-slate-300">
                {product.quantity}
              </td>

              <td className="text-center font-mono font-bold text-cyan-400">

                $
                {(
                  Number(product.price) *
                  Number(product.quantity)
                ).toFixed(2)}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}