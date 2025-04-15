import React from 'react'
import { useProductsByAdmin } from '../context/productsByAdmin'
import { Eraser, PenOff } from 'lucide-react';
export default function ProductsShow() {
    const { products } = useProductsByAdmin();
    // console.log(products);
  return (
    <div className=" mt-2 p-5 w-[85%] mx-auto rounded-lg ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-orange-600 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <div className='flex justify-between items-center'>
              <p className="text-orange-600 font-semibold">
                ${product.price}
              </p>
              <div className='flex gap-4'>
              <button><PenOff /></button>   
              <button><Eraser /></button>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
