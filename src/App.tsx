
import React from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import Index from './pages/Index';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotFound from './pages/NotFound';
import { AdminProviders } from './components/AdminProviders';
import LandingErrorBoundary from './components/LandingErrorBoundary';

function App() {
  console.log("App component rendering..."); // Debug log
  
  return (
    <Router>
      <Routes>
        {/* Landing page - sem providers complexos */}
        <Route path="/" element={
          <LandingErrorBoundary>
            <Index />
          </LandingErrorBoundary>
        } />
        
        {/* Admin routes - com providers completos */}
        <Route path="/admin/*" element={
          <AdminProviders>
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
              <Route path="/login" element={<AdminLogin />} />
            </Routes>
          </AdminProviders>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
