import React from 'react'
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ProductsPage from '@/pages/ProductsPage'

// Placeholder components for missing pages
const SalesPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Sales Page</h1><p className="mt-4">Sales management functionality will be implemented here.</p></div>
const CustomersPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Customers Page</h1><p className="mt-4">Customer management functionality will be implemented here.</p></div>
const ReportsPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Reports Page</h1><p className="mt-4">Reporting functionality will be implemented here.</p></div>
const SettingsPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Settings Page</h1><p className="mt-4">System settings functionality will be implemented here.</p></div>

// Protected Route Component
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, token } = useAuthStore()
  
  if (!user || !token) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, token } = useAuthStore()
  
  if (user && token) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pos-ui-theme">
      <div className="min-h-screen bg-background">
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HashRouter>
        
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App