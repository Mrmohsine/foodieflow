import React from 'react';
import { motion } from 'framer-motion';
import { Eraser, PenOff } from 'lucide-react';

const noop = () => {}; // Reference empty function for comparison

export default function ProductsShow({ products, onEdit = noop, onDelete = noop }) {
  const showActions = onEdit !== noop || onDelete !== noop;

  return (
    <div className="mt-2 p-5 w-[85%] mx-auto rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white rounded-lg shadow-md hover:shadow-xl"
          >
            <img src={product.img} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <div className="flex justify-between items-center">
                <p className="text-black font-semibold text-xl">
                  <span className="text-orange-500 text-lg">$</span>{product.price}
                </p>
                {showActions && (
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onEdit(product)}
                      className="text-orange-500"
                    >
                      <PenOff className="cursor-pointer" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onDelete(product.id)}
                      className="text-orange-500"
                    >
                      <Eraser className="cursor-pointer" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}