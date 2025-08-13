import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">POS System</h1>
          <p className="text-gray-600 mt-2">Complete Point of Sale Solution</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </div>
          </form>
          
          <div className="mt-8 border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              <p className="font-semibold mb-1">Demo Accounts:</p>
              <p>Admin: admin@pos.com / admin123</p>
              <p>Cashier: cashier@pos.com / cashier123</p>
              <p>Inventory: inventory@pos.com / inventory123</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy;{new Date().getFullYear()} POS System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;