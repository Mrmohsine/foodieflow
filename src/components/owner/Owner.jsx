import React ,{useState}from 'react';
import { Home, UtensilsCrossed, Flame, Bell, Package, LogOut, Users, BarChart3 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { Outlet ,NavLink , useLocation ,Navigate } from 'react-router-dom';



const navItems = [
  { icon: <UtensilsCrossed size={20} />  , label: 'Menu', path: 'menu' },
  { icon: <Users size={20} />, label: 'User', path: 'users' },
  { icon: <BarChart3 size={20} />, label: 'Analyse', path: 'analyse' },
];


export default function Owner() {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    
  return (
    <div className="flex min-h-screen bg-gray-50 pt-5">
      {/* Sidebar */}
      <motion.div
      initial={{ width: '4rem' }}
      animate={{ width: isHovered ? '14rem' : '4rem' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-foodie-orange text-white transition-all duration-300 flex flex-col py-6 px-2 shadow-lg"
    >
      <div className='fixed'>

      {navItems.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          className="flex items-center gap-3 px-4 py-3 hover:bg-foodie-dark-orange rounded-md transition-colors"
        >
          <div className="text-orange-500">{item.icon}</div>
          {isHovered && (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }} 
            className="whitespace-nowrap text-sm font-medium text-orange-500"
        >
            {item.label}
        </motion.span>
        )}
        </NavLink>
      ))}
      </div>
    </motion.div>

      {/* Content area */}
      <div className="flex-1 flex flex-col m-6">
      {location.pathname === '/owner' ?  <Navigate to="/owner/menu" /> : <Outlet />  } 
      </div>
    </div>
  );
}
