import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import Logo from '../components/Logo';

// Import icons
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiAlertTriangle
} from 'react-icons/fi';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    todaysSales: 0,
    todaysRevenue: 0,
    revenueChange: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration
        setStats({
          todaysSales: 12,
          todaysRevenue: 1250.75,
          revenueChange: 8.5,
          totalProducts: 45,
          totalCustomers: 128,
          lowStockProducts: 7,
          recentSales: [
            {
              id: 1,
              receiptNumber: 'RCP-001',
              totalAmount: 125.50,
              customer: 'John Doe',
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              receiptNumber: 'RCP-002',
              totalAmount: 85.25,
              customer: 'Jane Smith',
              createdAt: new Date().toISOString()
            },
            {
              id: 3,
              receiptNumber: 'RCP-003',
              totalAmount: 220.00,
              customer: 'Walk-in Customer',
              createdAt: new Date().toISOString()
            },
          ]
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Logo size="medium" className="mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Sales</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.todaysSales}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {stats.revenueChange >= 0 ? (
              <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(stats.revenueChange).toFixed(1)}%{' '}
              {stats.revenueChange >= 0 ? 'increase' : 'decrease'} from yesterday
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Revenue</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{formatCurrency(stats.todaysRevenue)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Average order: {formatCurrency(stats.todaysRevenue / stats.todaysSales)}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.totalProducts}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <FiPackage className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {stats.lowStockProducts} products with low stock
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customers</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.totalCustomers}</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <FiUsers className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total registered customers
            </span>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-200 font-medium">
                Low Stock Alert
              </p>
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                {stats.lowStockProducts} products are running low on inventory. Please check the inventory report.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Receipt
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentSales.length > 0 ? (
                stats.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {sale.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No recent sales
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;