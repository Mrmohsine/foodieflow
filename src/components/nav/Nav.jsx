import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { logout } from "../../firebase/firebase-auth";
import { useUser } from "../context/user";
import { toast } from "react-hot-toast";  // ← import toast

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // Map of roles to nav items.
  const roleBasedNavItems = {
    admin: ['kitchen', 'reception', 'supplier', 'owner']
  //   kitchen: ['kitchen'],
  //   reception: ['reception'],
  //   supplier: ['supplier'],
  };

  // Capitalize utility
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  // Active / inactive link classes
  const linkClassName = ({ isActive }) =>
    `px-3 py-1 rounded-full transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600 hover:bg-orange-100 focus:outline-none"
        : "text-gray-700 hover:text-orange-600"
    }`;

  // Render desktop nav items
  const renderNavItems = role => {
    const items = roleBasedNavItems[role] || [];
    return user ? (
      <div className="hidden md:flex space-x-8 items-center ml-10">
        {/* <NavLink to="/menu" className={linkClassName} end>
          Menu
        </NavLink> */}
        {items.map(item => (
          <NavLink
            key={item}
            to={`/${item === 'owner' ? `${item}/menu` : item}`}
            className={linkClassName}
          >
            {capitalize(item)}
          </NavLink>
        ))}
      </div>
    ) : null;
  };

  const toggleMenu = () => setIsOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error signing out: " + error.message);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-orange-500 text-xl font-bold">
              FoodieFlow
            </Link>
          </div>

          {/* Desktop Nav */}
          {renderNavItems(user?.role)}

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Sign Out
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

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-2 py-3">
            <NavLink to="/menu" className={linkClassName} onClick={() => setIsOpen(false)}>
              Menu
            </NavLink>
            {["kitchen", "reception", "owner", "supplier"].map(item => (
              <NavLink
                key={item}
                to={`/${item === 'owner' ? `${item}/menu` : item}`}
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
