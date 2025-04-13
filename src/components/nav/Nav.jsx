import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logout, auth } from "../../firebase/firebase-auth";
import { useFirestoreUser } from '../../User_crud/users_crud';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { firebaseUser, firestoreUser } = useFirestoreUser();

  // Listen for auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Map of roles to nav items.
  const roleBasedNavItems = {
    admin: ['kitchen', 'reception', 'supplier', 'owner'],
    kitchen: ['kitchen'],
    reception: ['reception'],
    supplier: ['supplier'],
  };

  // Utility to capitalize the first letter.
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Function to determine the className for active or inactive links.
  const linkClassName = ({ isActive }) =>
    `px-3 py-1 rounded-full transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600 hover:bg-orange-100 focus:outline-none"
        : "text-gray-700 hover:text-orange-600"
    }`;

  const renderNavItems = (role) => {
    const items = roleBasedNavItems[role] || [];
    return (
      <>
        {user && (
          <div className="hidden md:flex space-x-8 items-center ml-10">
            <NavLink to="/menu" className={linkClassName} end>
              Menu
            </NavLink>
            {items.map((item) => (
              <NavLink key={item} to={`/${item}`} className={linkClassName}>
                {capitalize(item)}
              </NavLink>
            ))}
          </div>
        )}
      </>
    );
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-orange-500 text-xl font-bold">
              FoodieFlow
            </Link>
          </div>

          {/* Center Section: Navigation Links (Desktop) */}
          {renderNavItems(firestoreUser?.role)}

          {/* Right Section: Auth */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Sign Outs
              </button>
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
            <NavLink
              to="/menu"
              className={linkClassName}
              onClick={() => setIsOpen(false)}
            >
              Menu
            </NavLink>
            {["kitchen", "reception", "owner/menu", "supplier"].map((item) => (
              <NavLink
                key={item}
                to={`/${item}`}
                className={linkClassName}
                onClick={() => setIsOpen(false)}
              >
                {capitalize(item)}
              </NavLink>
            ))}
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
          </div>
        </div>
      )}
    </nav>
  );
}