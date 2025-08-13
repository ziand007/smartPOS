import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HashRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;