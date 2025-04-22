import React, { useState } from 'react';
import { useProductsOrdered } from '../context/ProductsOrdered';
import {validateOrder} from '../context/ProductsMenu';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function KithenDash() {
  const ProductsOrder = useProductsOrdered();
  console.log('ProductsOrder:', ProductsOrder);

  const handleDetailsClick = (product) => {
    // TODO: implement details logic
    console.log('Details for', product);
  };
  const handleAddClick = (product) => {
    // TODO: implement add-to-cart logic
    console.log('Add to cart', product);
  };
  const handleValid = async (id) => {
    try {
      await validateOrder(id);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      {selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 shadow-2xl drop-shadow-2xl bg-transparent bg-opacity-60 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-11/12 md:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-orange-500 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Order #{selectedProduct.numberOrder}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-4 grid grid-cols-1 gap-4">
                    {selectedProduct.items.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                        <img src={item.img} alt={item.name} className="w-24 h-24 object-cover rounded" />
                        <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p>{item.description}</p>
                        <p><span className="font-semibold">Price:</span> ${item.price}</p>
                        <p><span className="font-semibold">Quantity:</span> {item.quantity}</p>
                        {item.instructions && (
                            <p>
                            <span className="font-semibold">Instructions:</span> {item.instructions}
                            </p>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
      <div className='mt-24 w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'> 
      {
        ProductsOrder.products
          .slice()
          .sort((a, b) => (b.numberOrder || 0) - (a.numberOrder || 0))
          .map((product) => (
              <>
          <motion.div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden mb-5 flex flex-col justify-between h-full"
            >
            {/* Card content */}
            <div className="p-4">
                <h1 className="font-semibold text-lg">Order #: {product.numberOrder}</h1>
                {product.items?.map((item, idx) => (
                <div key={idx} className="mt-2 ml-4">
                    <p className="text-sm font-medium">Item Name: {item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                ))}
            </div>

            {/* Button container at bottom-right */}
            <div className="flex justify-end">
                <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleValid(product.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${product.valid == true ? 'from-green-400 to-green-600' : 'from-orange-400 to-orange-600'} text-white rounded-lg px-4 py-2 m-4 shadow-md${product.valid == true ? 'hover:from-green-500 hover:to-green-700' : 'hover:from-orange-500 hover:to-orange-700'} `}
                >
                Valid
                </motion.button>
            </div>
            </motion.div>
          
          </>
        ))
      }
    </div>
    </>
  );
}
