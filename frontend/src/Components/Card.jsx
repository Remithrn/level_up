import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ children, noPadding }) => {
  let classes = 'bg-white shadow-md shadow-gray-300 mb-5 ';
  if (!noPadding) {
    classes += 'top-full z-10 items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white p-5';
  }

  return (
    <AnimatePresence>
      {children && (
        <motion.div
          className={classes}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Card;
