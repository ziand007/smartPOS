import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import Logo from '../components/Logo';

// Import icons
import { 
  FiGrid, FiPackage, FiShoppingCart, FiUsers, 
  FiBarChart2, FiSettings, FiLogOut, FiMenu, 
  FiX, FiSun, FiMoon 
} from 'react-icons/fi';

const DashboardLayout = () => {
  const navigate = useNavigate();
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const handleLogout = async () => {
    try {
      // Try to sign out from Supabase if connected
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      // Redirect to login
      navigate('/auth/login');
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { path: '/products', label: 'Products', icon: <FiPackage size={20} /> },
    { path: '/sales', label: 'Sales', icon: <FiShoppingCart size={20} /> },
    { path: '/customers', label: 'Customers', icon: <FiUsers size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Logo size="medium" className="mr-3" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">POS System</h1>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="px-2 py-4">
          <div className="mb-4 px-4 py-2">
            <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
              Logged in as
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 px-4">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <span className="mr-3">
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </span>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <span className="mr-3">
                <FiLogOut size={20} />
              </span>
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;