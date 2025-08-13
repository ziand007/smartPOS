import React, {useState, useEffect} from 'react';
import {FiDownload, FiBarChart2, FiPackage} from 'react-icons/fi';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import {formatCurrency} from '../lib/utils';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    summary: {},
    dailySales: [],
    topProducts: []
  });
  const [inventoryData, setInventoryData] = useState({
    summary: {},
    lowStockProducts: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  // Mock data
  const mockSalesData = {
    summary: {
      totalSales: 156,
      totalRevenue: 12450.75,
      totalDiscount: 580.25,
      totalTax: 745.80,
      averageOrderValue: 79.81,
      paymentMethodBreakdown: {
        CASH: {count: 78, amount: 5890.25},
        CARD: {count: 65, amount: 5320.50},
        E_WALLET: {count: 13, amount: 1240.00}
      },
      categoryBreakdown: {
        Electronics: {count: 85, revenue: 8520.50},
        'Home & Kitchen': {count: 42, revenue: 1250.75},
        Stationery: {count: 65, revenue: 552.50},
        'Sports & Outdoors': {count: 28, revenue: 2127.00}
      }
    },
    dailySales: [
      {date: '2023-12-01', count: 5, revenue: 425.50},
      {date: '2023-12-02', count: 8, revenue: 680.25},
      {date: '2023-12-03', count: 6, revenue: 520.75},
      {date: '2023-12-04', count: 4, revenue: 350.00},
      {date: '2023-12-05', count: 7, revenue: 590.50},
      {date: '2023-12-06', count: 9, revenue: 745.25},
      {date: '2023-12-07', count: 6, revenue: 510.00}
    ],
    topProducts: [
      {name: 'Wireless Bluetooth Headphones', quantity: 45, revenue: 4499.55},
      {name: 'Water Bottle - Stainless Steel', quantity: 35, revenue: 874.65},
      {name: 'USB-C Cable - 6ft', quantity: 28, revenue: 447.72},
      {name: 'Coffee Mug - Ceramic', quantity: 25, revenue: 324.75},
      {name: 'Notebook - A5 Lined', quantity: 20, revenue: 170.00}
    ]
  };

  const mockInventoryData = {
    summary: {
      totalProducts: 45,
      totalValue: 8750.25,
      lowStockCount: 7,
      categories: {
        Electronics: {count: 15, value: 4500.50, lowStock: 3},
        'Home & Kitchen': {count: 12, value: 1850.75, lowStock: 2},
        Stationery: {count: 10, value: 750.00, lowStock: 1},
        'Sports & Outdoors': {count: 8, value: 1649.00, lowStock: 1}
      }
    },
    lowStockProducts: [
      {id: '1', name: 'Wireless Bluetooth Headphones', sku: 'PROD-001', stockQty: 5, reorderLevel: 10},
      {id: '2', name: 'USB-C Cable - 6ft', sku: 'PROD-004', stockQty: 2, reorderLevel: 10},
      {id: '3', name: 'Notebook - A5 Lined', sku: 'PROD-003', stockQty: 8, reorderLevel: 15}
    ]
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'sales') {
        // In a real app, we would fetch sales data from API with date range
        setTimeout(() => {
          setSalesData(mockSalesData);
          setLoading(false);
        }, 500);
      } else {
        // In a real app, we would fetch inventory data from API
        setTimeout(() => {
          setInventoryData(mockInventoryData);
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to load report data:', error);
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const {name, value} = e.target;
    setDateRange({...dateRange, [name]: value});
  };

  const handleDownloadReport = () => {
    alert('Download functionality would be implemented here');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiDownload className="h-5 w-5 mr-2" /> Download Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'sales'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('sales')}
        >
          <FiBarChart2 className="inline-block mr-2" /> Sales Report
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'inventory'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          <FiPackage className="inline-block mr-2" /> Inventory Report
        </button>
      </div>

      {/* Report Content */}
      {activeTab === 'sales' ? (
        <div className="space-y-6">
          {/* Date Range Selector */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{salesData.summary.totalSales}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(salesData.summary.totalRevenue)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(salesData.summary.averageOrderValue)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tax</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(salesData.summary.totalTax)}</p>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Sales Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => name === 'revenue' ? formatCurrency(value) : value} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" name="Orders" stroke="#8884d8" activeDot={{r: 8}} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods and Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Payment Methods</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(salesData.summary.paymentMethodBreakdown).map(([key, value]) => ({
                        name: key === 'E_WALLET' ? 'E-Wallet' : key.charAt(0) + key.slice(1).toLowerCase(),
                        value: value.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(salesData.summary.paymentMethodBreakdown).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(salesData.summary.categoryBreakdown).map(([key, value]) => ({
                      name: key,
                      revenue: value.revenue
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Top Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Quantity Sold
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {salesData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inventoryData.summary.totalProducts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Inventory Value</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(inventoryData.summary.totalValue)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Items</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inventoryData.summary.lowStockCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Object.keys(inventoryData.summary.categories).length}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Category Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(inventoryData.summary.categories).map(([key, value]) => ({
                    name: key,
                    count: value.count,
                    value: value.value,
                    lowStock: value.lowStock
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => name === 'value' ? formatCurrency(value) : value} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="Product Count" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="lowStock" name="Low Stock" fill="#FF8042" />
                  <Bar yAxisId="right" dataKey="value" name="Value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Low Stock Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      SKU
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Current Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Reorder Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {inventoryData.lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          {product.stockQty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                        {product.reorderLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;