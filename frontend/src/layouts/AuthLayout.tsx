import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            POS System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete Point of Sale Solution
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <Outlet />
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} POS System. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;