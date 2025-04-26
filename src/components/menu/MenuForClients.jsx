import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X, Plus } from 'lucide-react';
import { useProductsForClient } from '../context/ProductsForClient';
import { addProductOrder } from '../context/ProductsMenu';
import { toast } from 'react-hot-toast';  // ← import toast

export default function MenuForClients() {
  const products = useProductsForClient()?.products || [];

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qtyModalProduct, setQtyModalProduct] = useState(null);
  const [detailsProducts, setDetailsProducts] = useState(null);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');

  const handleAddClick = (product) => {
    setQtyModalProduct(product);
    setQty(1);
  };
  const handledetailsClick = (product) => {
    setDetailsProducts(product);
  };

  const confirmAddToCart = () => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === qtyModalProduct.id);
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...qtyModalProduct, quantity: qty, instructions }];
    });
    setQtyModalProduct(null);
    setInstructions('');
  };

  const handleOrder = async () => {
    try {
      await addProductOrder(cartItems);
      setCartItems([]);
      setIsCartOpen(false);
      toast.success('Order submitted!');  // ← success toast
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('Failed to submit order: ' + error.message);  // ← error toast
    }
  };

  const handleCounter = (e) => {
    if (e.target.innerText === '-') {
      setQty(prev => Math.max(1, prev - 1));
    } else {
      setQty(prev => prev + 1);
    }
  };

  return (
    <>
      {/* Cart icon */}
      <div
        onClick={() => setIsCartOpen(true)}
        className="px-3 py-2 flex w-[85%] items-center cursor-pointer justify-end text-gray-700 hover:text-orange-600 transition-colors"
      >
        <ShoppingCart className="h-5 w-5 mr-2 text-orange-500" />
        <span className="font-semibold text-orange-600">Cart ({cartItems.length})</span>
      </div>

      {/* Products grid */}
      <div className="p-5 w-[85%] mx-auto rounded-lg mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden"
              onClick={() => handledetailsClick(product)}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center">
                  <p className="text-black font-semibold text-xl">
                    <span className="text-orange-500 text-lg">$</span>
                    {product.price}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={e => {
                      e.stopPropagation();
                      handleAddClick(product);
                    }}
                    className="px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg shadow-md hover:from-orange-500 hover:to-orange-700"
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity Picker Modal */}
      {qtyModalProduct && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border-2 border-orange-500 p-6 w-80 shadow-lg">
            <div className='flex justify-between items-center mb-4'>
              <h3 className="text-lg font-bold text-orange-600 ">
                How many “{qtyModalProduct.name}”?
              </h3>
              <button
                onClick={() => setQtyModalProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-between border-2 border-orange-500 rounded-full px-4 py-2 w-40">
                <button onClick={handleCounter} className="text-orange-500 text-2xl font-bold hover:text-orange-600">
                  -
                </button>
                <span className="text-xl font-semibold text-gray-800">{qty}</span>
                <button onClick={handleCounter} className="text-orange-500 text-2xl font-bold hover:text-orange-600">
                  +
                </button>
              </div>
            </div>
            <textarea
              rows="2"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Add special instructions (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setQtyModalProduct(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToCart}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsProducts && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border-2 border-orange-500 p-6 w-80 shadow-lg">
            <div className='flex justify-between items-center mb-4'>
              <h3 className="text-lg font-bold text-orange-600 ">
                Details of “{detailsProducts.name}”
              </h3>
              <button
                onClick={() => setDetailsProducts(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{detailsProducts.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setDetailsProducts(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Contents Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-auto shadow-xl border border-orange-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-600">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      {item.instructions && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          “{item.instructions}”
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleOrder}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700"
              >
                Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
