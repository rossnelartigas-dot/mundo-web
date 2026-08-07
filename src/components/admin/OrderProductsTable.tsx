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
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Imagen</th>
            <th className="text-left">Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t"
            >
              <td className="p-4">
                <img
                  src={product.image || "/no-image.png"}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover border"
                />
              </td>

              <td className="font-medium">
                {product.name}
              </td>

              <td className="text-center">
                ${product.price}
              </td>

              <td className="text-center">
                {product.quantity}
              </td>

              <td className="text-center font-bold text-cyan-600">
                $
                {(
                  product.price *
                  product.quantity
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}