import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Prediction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 to-black text-white p-6 relative overflow-hidden">
      {/* Particle Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,_rgba(0,255,100,0.1)_0%,_transparent_50%)] before:animate-pulse before:opacity-50"></div>
        <div className="before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_70%,_rgba(0,255,100,0.1)_0%,_transparent_50%)] before:animate-pulse before:opacity-50 before:delay-1000"></div>
      </div>

      {/* Prediction Result Section */}
      <motion.section
        className="max-w-2xl mx-auto text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Prediction Result
        </motion.h1>
        <motion.p
          className="text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          After analyzing the symptoms and picture you uploaded, the predicted disease is <span className="font-semibold text-green-400">XYZ</span>.
        </motion.p>
      </motion.section>

      {/* Advices Button */}
      <motion.section
        className="w-full max-w-md mx-auto relative z-10"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.button
          className="w-full py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          onClick={handleToggleModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          View Advices
        </motion.button>
      </motion.section>

      {/* Pop-up Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Recommended Cure</h2>
            <p className="text-lg mb-6">ABCD is your plant's cure.</p>
            <motion.button
              className="py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              onClick={handleToggleModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Prediction;