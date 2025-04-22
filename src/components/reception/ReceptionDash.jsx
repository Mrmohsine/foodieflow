import React from 'react'
import { useProductsOrderedForClient } from '../context/ProductsOrderedForClient'
import { motion } from 'framer-motion';
import { paymentOrder } from '../context/ProductsMenu';

export default function ReceptionDash() {
    const Products = useProductsOrderedForClient();

      const handleValid = async (id) => {
        try {
          await paymentOrder(id);
        } catch (err) {
          console.error('Validation error:', err);
        }
      };
  return (
    <div className='mt-25'>
        <div className='mt-24 w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'> 
      {
        Products.products
          .slice()
          .sort((a, b) => (b.numberOrder || 0) - (a.numberOrder || 0))
          .map((product) => (
              <>
          <motion.div
            key={product.id}
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
            <div className="flex justify-end">
                <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleValid(product.id);                  
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${product.valid == true ? 'from-orange-400 to-orange-600' : 'from-orange-400 to-orange-600'} text-white rounded-lg px-4 py-2 m-4 shadow-md${product.valid == true ? 'hover:from-orange-500 hover:to-orange-700' : 'hover:from-orange-500 hover:to-orange-700'} `}
                >
                Payment
                </motion.button>
            </div>
            </motion.div>
          
          </>
        ))
      }
    </div>
    </div>
  )
}
