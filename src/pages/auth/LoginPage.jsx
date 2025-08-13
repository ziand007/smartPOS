import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase';
import Logo from '../../components/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Demo accounts validation
      const validAccounts = [
        { email: 'admin@pos.com', password: 'admin123', role: 'ADMIN' },
        { email: 'cashier@pos.com', password: 'cashier123', role: 'CASHIER' },
        { email: 'inventory@pos.com', password: 'inventory123', role: 'INVENTORY_MANAGER' }
      ];
      const account = validAccounts.find(acc => acc.email === email && acc.password === password);
      if (account) {
        // Simulate successful login
        console.log('Login successful!', account);
        // Store user info in localStorage (simulating auth state)
        const user = {
          id: `demo-${Date.now()}`,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email,
          role: account.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', `demo-token-${Date.now()}`);
        // Use React Router navigate instead of window.location
        navigate('/dashboard');
      } else {
        // Try Supabase login as fallback
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          if (data.user) {
            // Store Supabase user info
            const user = {
              id: data.user.id,
              name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
              email: data.user.email,
              role: 'USER'
            };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', data.session.access_token);
            navigate('/dashboard');
          }
        } catch (supabaseError) {
          console.error('Supabase login error:', supabaseError);
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">POS System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete Point of Sale Solution</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Log In</h2>
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Register
              </Link>
            </p>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">Demo Accounts:</p>
              <p>Admin: admin@pos.com / admin123</p>
              <p>Cashier: cashier@pos.com / cashier123</p>
              <p>Inventory: inventory@pos.com / inventory123</p>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          &copy;{new Date().getFullYear()} POS System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;