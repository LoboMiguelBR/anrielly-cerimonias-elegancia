
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
