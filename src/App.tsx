import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { Toaster } from 'sonner';
import { GalleryProvider } from './components/gallery/GalleryContext';

function App() {
  return (
    <GalleryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </GalleryProvider>
  );
}

export default App;
