// src/components/reception/Valid.jsx
import React, { useState } from 'react';
import { useProductsOrderedForClient } from '../context/ProductsOrderedForClient';
import { motion } from 'framer-motion';
import { paymentOrder } from '../context/ProductsMenu';
import { X } from 'lucide-react';

export default function Valid() {
  const { products } = useProductsOrderedForClient();
  const [orderToPay, setOrderToPay] = useState(null);

  const confirmPayment = async (id) => {
    try {
      await paymentOrder(id);
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setOrderToPay(null);
    }
  };

  return (
    <div className="mt-24 w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {products
        .slice()
        .sort((a, b) => (b.numberOrder || 0) - (a.numberOrder || 0))
        .map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            <div className="p-4">
              <h1 className="font-semibold text-lg">
                Order #: {product.numberOrder}
              </h1>
              {product.items?.map((item, idx) => (
                <div key={idx} className="mt-2 ml-4">
                  <p className="text-sm font-medium">Item: {item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setOrderToPay(product);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg px-4 py-2 m-4 shadow-md hover:from-orange-500 hover:to-orange-700"
              >
                Payment
              </motion.button>
            </div>
          </motion.div>
        ))}

      {/* Confirmation Modal */}
      {orderToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Pay Order #{orderToPay.numberOrder}?
              </h3>
              <button
                onClick={() => setOrderToPay(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this order as paid?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOrderToPay(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmPayment(orderToPay.id)}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow-md"
              >
                Yes, Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
