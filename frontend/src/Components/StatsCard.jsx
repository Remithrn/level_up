import { motion } from 'framer-motion';
import React from 'react';

const StatsCard = ({ children, cols = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`flex ${cols ? 'flex-col items-center justify-center ' : ''} gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4 hover:border-gray-400 hover:bg-stone-100`}
    >
      {children}
    </motion.div>
  );
};

export default StatsCard;
