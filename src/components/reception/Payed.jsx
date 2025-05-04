import React from 'react';
import { useProductsOrderedForClient } from '../context/ProductsOrderedForClient';
import { motion } from 'framer-motion';

export default function Payed() {
  const { products } = useProductsOrderedForClient();

  return (
    <div className="mt-24 w-[85%] mx-auto">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products
            .slice()
            .sort((a, b) => (b.numberOrder || 0) - (a.numberOrder || 0))
            .map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Paid badge */}
                <span className="absolute top-2 right-2 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  Paid
                </span>

                <div className="p-4">
                  <h1 className="font-semibold text-lg">Order #: {product.numberOrder}</h1>
                  {product.items?.map((item, idx) => (
                    <div key={idx} className="mt-2 ml-4">
                      <p className="text-sm font-medium">Item: {item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">No paid orders yet.</p>
      )}
    </div>
  );
}
