import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './lib/supabase';

const DashboardPage = () => {
  const navigate = useNavigate();
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Welcome, {user.name || 'User'}!</h2>
        <p>
          You are logged in as: <span className="font-semibold">{user.role || 'Guest'}</span>
        </p>
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;