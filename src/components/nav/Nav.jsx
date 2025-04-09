import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react"; // Icons from lucide-react
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "../../firebase/firebase-auth";
import { useUser } from '../context/users';  // Custom hook to fetch one user by uid

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Listen for auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Only fetch Firestore user data when we have an authenticated user
  const firestoreUser = user ? useUser(user.uid) : null;

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false); // Close mobile menu on logout
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-orange-500 text-xl font-bold">
              FoodieFlow
            </Link>
          </div>

          {/* Center Section: Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center ml-10">
            <Link
              to="/menu"
              className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-100 focus:outline-none"
            >
              Menu
            </Link>
            <Link
              to="/kitchen"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Kitchen
            </Link>
            <Link
              to="/reception"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Reception
            </Link>
            <Link
              to="/owner"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Owner
            </Link>
            <Link
              to="/supplier"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Supplier
            </Link>
          </div>

          {/* Right Section: Auth and Cart (Desktop) */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  Sign Out
                </button>
                {/* Use optional chaining in case firestoreUser is still loading */}
                <p>
                  hi {firestoreUser?.fullName} u r {firestoreUser?.role}
                </p>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-2 py-3">
            <Link
              to="/menu"
              className="block w-full text-left bg-orange-50 text-orange-600 px-3 py-2 rounded-full hover:bg-orange-100 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/kitchen"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Kitchen
            </Link>
            <Link
              to="/reception"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Reception
            </Link>
            <Link
              to="/owner"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Owner
            </Link>
            <Link
              to="/supplier"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Supplier
            </Link>
          </div>
          <div className="space-y-1 px-2 py-3 border-t border-gray-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="block px-3 py-2 flex items-center text-gray-700 hover:text-orange-600 transition-colors relative"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}