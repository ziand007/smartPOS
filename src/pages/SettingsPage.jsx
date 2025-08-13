import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiShoppingBag, FiDollarSign, FiGlobe } from 'react-icons/fi';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Demo POS Store',
    storeAddress: '123 Main Street, City, State 12345',
    storePhone: '+1-555-123-4567',
    storeEmail: 'store@pos.com',
    taxRate: 8.5,
    currency: 'USD',
    receiptNote: 'Thank you for your business!'
  });

  const handleStoreSettingChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings({
      ...storeSettings,
      [name]: name === 'taxRate' ? parseFloat(value) : value
    });
  };

  const saveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 500);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Settings</h1>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 text-green-700 dark:text-green-300">
          <p>{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === 'store'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('store')}
        >
          <FiShoppingBag className="inline-block mr-2" /> Store Settings
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === 'user'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('user')}
        >
          <FiUser className="inline-block mr-2" /> User Management
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === 'payment'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('payment')}
        >
          <FiDollarSign className="inline-block mr-2" /> Payment Methods
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === 'system'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('system')}
        >
          <FiGlobe className="inline-block mr-2" /> System
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {activeTab === 'store' && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Store Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={storeSettings.storeEmail}
                  onChange={handleStoreSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Phone
                </label>
                <input
                  type="tel"
                  name="storePhone"
                  value={storeSettings.storePhone}
                  onChange={handleStoreSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={storeSettings.currency}
                  onChange={handleStoreSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Address
                </label>
                <textarea
                  name="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={handleStoreSettingChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Sales Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={storeSettings.taxRate}
                    onChange={handleStoreSettingChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Receipt Note
                  </label>
                  <textarea
                    name="receiptNote"
                    value={storeSettings.receiptNote}
                    onChange={handleStoreSettingChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="This message will appear at the bottom of receipts"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={saveSettings}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'user' && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              User management settings will be implemented here.
            </p>
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div className="text-center py-12">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Payment Methods</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Payment method configuration will be implemented here.
            </p>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="text-center py-12">
            <FiGlobe className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">System Settings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              System configuration options will be implemented here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;