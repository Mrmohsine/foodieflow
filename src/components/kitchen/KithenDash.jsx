import React, { useState } from 'react';
import { useProductsOrdered } from '../context/ProductsOrdered';
import { validateOrder } from '../context/ProductsMenu';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function KitchenDash() {
  const { products = [] } = useProductsOrdered();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [validationModalOrderId, setValidationModalOrderId] = useState(null);

  const handleValid = async (id) => {
    try {
      await validateOrder(id);
      setValidationModalOrderId(null);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  // find the order object for the modal
  const orderToValidate = products.find(o => o.id === validationModalOrderId);

  return (
    <>
      {/* DETAILS MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-lg w-11/12 md:w-1/2 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Order #{selectedProduct.numberOrder}
              </h2>
              <button onClick={() => setSelectedProduct(null)}>
                <X size={24} />
              </button>
            </header>
            <div className="p-6 space-y-4">
              {selectedProduct.items.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm">{item.description}</p>
                    <p>
                      <span className="font-semibold">Quantity:</span> {item.quantity}
                    </p>
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
      )}

      {/* ORDERS GRID */}
      <div className="mt-24 w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products
          .slice()
          .sort((a, b) => (b.numberOrder || 0) - (a.numberOrder || 0))
          .map(product => (
            <React.Fragment key={product.id}>
              <motion.div
                onClick={() => setSelectedProduct(product)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.99 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden mb-5 flex flex-col justify-between h-full"
              >
                <div className="p-4">
                  <h1 className="font-semibold text-lg">
                    Order #: {product.numberOrder}
                  </h1>
                  {product.items.map((item, idx) => (
                    <div key={idx} className="mt-2 ml-4">
                      <p className="text-sm font-medium">Item: {item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();            // ← prevent card click
                      setValidationModalOrderId(product.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`m-4 px-4 py-2 rounded-lg shadow-md text-white
                      bg-gradient-to-r ${
                        product.valid
                          ? 'from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'
                          : 'from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700'
                      }`}
                  >
                    {product.valid ? 'Validated' : 'Validate'}
                  </motion.button>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
      </div>

      {/* VALIDATION CONFIRMATION MODAL */}
      {orderToValidate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl border-2 border-orange-500 p-6 w-80 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-orange-600">
                Validate order #{orderToValidate.numberOrder}?
              </h3>
              <button
                onClick={() => setValidationModalOrderId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setValidationModalOrderId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleValid(orderToValidate.id)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-md"
              >
                Yes, validate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
