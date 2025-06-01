
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AuthPage from './components/auth/AuthPage';
import QuestionarioLogin from './pages/QuestionarioLogin';
import QuestionarioFormulario from './pages/QuestionarioFormulario';
import ContractSigning from './pages/ContractSigning/index';
import NotFound from './pages/NotFound';
import DynamicLandingPage from './components/DynamicLandingPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import WebChat from './components/WebChat';
import { Toaster } from 'sonner';
import { GalleryProvider } from './components/gallery/GalleryContext';

function App() {
  return (
    <GalleryProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Rotas de autenticação */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Dashboard para usuários não-admin */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['cliente', 'noivo', 'noiva', 'cerimonialista']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard admin completo */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
        
        {/* Outras rotas */}
        <Route path="/questionario/:linkPublico" element={<QuestionarioLogin />} />
        <Route path="/questionario/:linkPublico/formulario" element={<QuestionarioFormulario />} />
        <Route path="/contrato/:slug" element={<ContractSigning />} />
        
        {/* Rota dinâmica para landing pages - deve vir por último */}
        <Route path="/:slug" element={<DynamicLandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WebChat />
      <Toaster position="top-right" richColors />
    </GalleryProvider>
  );
}

export default App;
