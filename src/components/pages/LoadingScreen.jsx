// components/LoadingScreen.jsx
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 border-4 border-foodie-orange border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-foodie-orange"
        >
          Loading FoodieFlow...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;