import React, {useState} from 'react';
import {Outlet, NavLink, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useAuthStore} from '@/store/authStore';
import {useTheme} from '@/components/theme-provider';

// Import only the specific icons we need instead of the entire library
import {LayoutDashboard, Package2, ShoppingCart, Users, BarChart2, Settings, LogOut, Menu, X, Sun, Moon} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const {user, logout} = useAuthStore();
  const {theme, setTheme} = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    {path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />},
    {path: '/products', label: 'Products', icon: <Package2 size={20} />},
    {path: '/sales', label: 'Sales', icon: <ShoppingCart size={20} />},
    {path: '/customers', label: 'Customers', icon: <Users size={20} />},
    {path: '/reports', label: 'Reports', icon: <BarChart2 size={20} />},
    {path: '/settings', label: 'Settings', icon: <Settings size={20} />},
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
      <motion.aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">POS System</h1>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={20} />
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
              {user?.role.replace('_', ' ')}
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({isActive}) =>
                  `
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  }
                `
                }
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
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <span className="mr-3">
                <LogOut size={20} />
              </span>
              Log Out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu size={24} />
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