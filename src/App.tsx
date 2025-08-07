
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import QuestionarioLogin from './pages/QuestionarioLogin';
import QuestionarioFormulario from './pages/QuestionarioFormulario';
import ContractSigning from './pages/ContractSigning/index';
import NotFound from './pages/NotFound';
import DynamicLandingPage from './components/DynamicLandingPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import WebChat from './components/WebChat';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import { GalleryProvider } from './components/gallery/GalleryContext';
import { ClientPortal } from './pages/ClientPortal';

function App() {
  return (
    <ErrorBoundary>
      <GalleryProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/questionario/:linkPublico" element={<QuestionarioLogin />} />
          <Route path="/questionario/:linkPublico/formulario" element={<QuestionarioFormulario />} />
          <Route path="/contrato/:slug" element={<ContractSigning />} />
          <Route path="/cliente/:token" element={<ClientPortal />} />
          {/* Rota dinâmica para landing pages - deve vir por último */}
          <Route path="/:slug" element={<DynamicLandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WebChat />
        <Toaster position="top-right" richColors />
      </GalleryProvider>
    </ErrorBoundary>
  );
}

export default App;
