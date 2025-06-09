
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
import { AuthProvider } from '@/hooks/useAuthEnhanced';
import { AdminMasterRoutes } from '@/routes/AdminMasterRoutes';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GalleryProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Rotas do Admin Master */}
              <Route path="/admin-master/*" element={<AdminMasterRoutes />} />
              
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
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
