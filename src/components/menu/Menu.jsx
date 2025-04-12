import React from 'react'
import { Link } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";

export default function Menu() {
  return (<>
            <Link
              to="/cart"
              className="block px-3 py-2 flex items-center text-gray-700 hover:text-orange-600 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Link>
  
  <div className='flex justify-center items-center flex-col h-screen'><h1>MENU</h1></div>
  </>
  )
}
