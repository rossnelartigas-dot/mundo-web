import Link from "next/link";
import Image from 'next/image';

import { getProducts } from "@/services/productService";

import DeleteButton from "@/components/admin/DeleteButton";



export default async function ProductsPage() {


  const products = await getProducts();



  return (

    <div>


      <div className="flex justify-between items-center mb-8">


        <h1 className="text-3xl font-bold">

          Productos

        </h1>




        <Link

          href="/admin/products/new"

          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-lg"

        >

          Nuevo Producto


        </Link>



      </div>






      <div className="bg-white rounded-xl shadow overflow-hidden">


        <table className="w-full">


          <thead className="bg-slate-200">


            <tr>


              <th className="p-4 text-left">

                Imagen

              </th>


              <th className="p-4 text-left">

                Producto

              </th>


              <th>

                SKU

              </th>


              <th>

                Precio

              </th>


              <th>

                Stock

              </th>


              <th>

                Estado

              </th>


              <th>

                Destacado

              </th>


              <th>

                Acciones

              </th>


            </tr>


          </thead>






          <tbody>


            {products.map((product)=>(


              <tr

                key={product.id}

                className="border-b hover:bg-slate-50"

              >



                <td className="p-4">


                  {product.image ? (

                    <Image

                      src={product.image}

                      alt={product.name}

                      width={64}

                      height={64}

                      className="object-cover rounded-lg border"

                    />

                  ) : (

                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">

                      Sin imagen

                    </div>

                  )}



                </td>






                <td className="p-4">


                  <div className="font-semibold">

                    {product.name}

                  </div>


                  <div className="text-sm text-gray-500">

                    {product.brand}

                  </div>


                </td>






                <td>


                  {product.sku}


                </td>







                <td>


                  ${product.price}


                </td>







                <td>


                  {product.stock}


                </td>







                <td>


                  {product.active ? (


                    <span className="text-green-600 font-medium">

                      Activo

                    </span>


                  ):(


                    <span className="text-red-600 font-medium">

                      Inactivo

                    </span>


                  )}



                </td>







                <td>


                  {product.featured ? (

                    <span className="text-cyan-600">

                      Sí

                    </span>


                  ):(


                    "No"


                  )}



                </td>







                <td className="space-x-2">


                  <Link

                    href={`/admin/products/${product.id}`}

                    className="bg-blue-600 text-white px-3 py-2 rounded-lg"

                  >

                    Editar


                  </Link>





                  <DeleteButton

                    id={product.id}

                  />


                </td>




              </tr>


            ))}



          </tbody>




        </table>



      </div>




    </div>


  );

}