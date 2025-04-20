import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useProductsForClient } from '../context/ProductsForClient';
import {X} from 'lucide-react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { addProductOrder } from '../context/ProductsMenu';

export default function MenuForClients() {
  const products = useProductsForClient()?.products || [];

  // State for the cart, modals, and quantity picker
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qtyModalProduct, setQtyModalProduct] = useState(null);
  const [detailsProducts, setDetailsProducts] = useState('');
  const [qty, setQty] = useState(1);

  // Open the quantity modal for a given product
  const handleAddClick = (product) => {
    setQtyModalProduct(product);
    setQty(1);
  };
  const handledetailsClick = (product) => {
    setDetailsProducts(product);
  };

  // Confirm adding to cart
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
      return [...prev, { ...qtyModalProduct, quantity: qty }];
    });
    setQtyModalProduct(null);
  };

  // Submit the cart order to Firestore
  const handleOrder = async () => {
    try {
      // const auth = getAuth();
      // const user = auth.currentUser;
      // if (!user) {
      //   alert('Please log in to place an order.');
      //   return;
      // }
      // const db = getFirestore();
      // await addDoc(collection(db, 'products_ordered'), {
      //   clientId: user.uid,
      //   items: cartItems,
      //   createdAt: serverTimestamp(),
      // });
      // alert('Order submitted!');
      await addProductOrder(cartItems);
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Failed to submit order: ' + error.message);
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
                  
                  <div className='flex gap-2'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handledetailsClick(product)}
                    className="px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg shadow-md hover:from-orange-500 hover:to-orange-700"
                  >
                   details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAddClick(product)}
                    className="px-5 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg shadow-md hover:from-orange-500 hover:to-orange-700"
                  >
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity Picker Modal */}
      {qtyModalProduct && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border-2 border-orange-500 p-6 w-80 shadow-lg">
            <div className='flex justify-between items-center mb-4'>
            <h3 className="text-lg font-bold text-orange-600 ">
              How many &quot;{qtyModalProduct.name}&quot;?
            </h3>
            <button
                onClick={() => setQtyModalProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
      {detailsProducts && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border-2 border-orange-500 p-6 w-[30rem] shadow-lg">
            <div className='flex justify-between items-center mb-4'>
            <h3 className="text-lg font-bold text-orange-600 ">
              Details of  &quot;{detailsProducts.name}&quot;
            </h3>
            <button
                onClick={() => setDetailsProducts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{detailsProducts.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDetailsProducts(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              
            </div>
          </div>
        </div>
      )}

      {/* Cart Contents Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
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
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-end ">
              <button
                onClick={handleOrder}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700"
              >
                order
              </button>
              {/* <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
