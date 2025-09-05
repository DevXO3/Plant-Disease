import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // Simulate a 2-second loading
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 to-black text-white p-6 relative overflow-hidden">
      {/* Particle Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,_rgba(0,255,100,0.1)_0%,_transparent_50%)] before:animate-pulse before:opacity-50"></div>
        <div className="before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_70%,_rgba(0,255,100,0.1)_0%,_transparent_50%)] before:animate-pulse before:opacity-50 before:delay-1000"></div>
      </div>

      {/* Description Section */}
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
          Plant Disease Prediction
        </motion.h1>
        <motion.p
          className="text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Welcome to our Plant Disease Prediction platform! Upload an image of your plant and describe its symptoms below. 
          Our system will help analyze potential diseases to keep your plants healthy and thriving.
        </motion.p>
      </motion.section>

      {/* Image Upload Box */}
      <motion.section
        className="mb-12 w-full max-w-md mx-auto relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Upload Plant Image</h2>
        <motion.div
          className="border-2 border-dashed border-green-500 p-8 text-center rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-700 file:text-white hover:file:bg-green-600"
          />
          <p className="mt-2 text-gray-400">Upload an image of the affected plant (PNG, JPG)</p>
        </motion.div>
      </motion.section>

      {/* Symptoms Input Area */}
      <motion.section
        className="w-full max-w-md mx-auto relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Describe Symptoms</h2>
        <motion.textarea
          className="w-full h-40 p-4 bg-gray-800 border border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
          placeholder="Describe the symptoms of your plant (e.g., yellowing leaves, spots, wilting, etc.)"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        ></motion.textarea>
        <motion.button
          className="mt-4 w-full py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          onClick={handleSubmit}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit'
          )}
        </motion.button>
      </motion.section>
    </div>
  );
};

export default Home;