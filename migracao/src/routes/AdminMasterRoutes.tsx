import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminMasterLayout } from '@/layouts/AdminMasterLayout';
import { AdminMasterDashboard } from '@/pages/admin-master/AdminMasterDashboard';
import { TenantsManagement } from '@/components/admin-master/TenantsManagement';
import { FinancialSystem } from '@/components/admin-master/FinancialSystem';
import { SystemMonitoring } from '@/components/admin-master/SystemMonitoring';

// Páginas específicas do Admin Master
function TenantsPage() {
  return <TenantsManagement />;
}

function FinancialPage() {
  return <FinancialSystem />;
}

function MonitoringPage() {
  return <SystemMonitoring />;
}

function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os usuários do sistema
        </p>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        Página de gestão de usuários será implementada aqui
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Configure parâmetros globais do sistema
        </p>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        Página de configurações será implementada aqui
      </div>
    </div>
  );
}

// Rotas do Admin Master
export function AdminMasterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminMasterLayout />}>
        <Route index element={<AdminMasterDashboard />} />
        
        {/* Rotas de Tenants */}
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenants/new" element={<TenantsPage />} />
        <Route path="tenants/settings" element={<TenantsPage />} />
        
        {/* Rotas Financeiras */}
        <Route path="financial" element={<FinancialPage />} />
        <Route path="financial/subscriptions" element={<FinancialPage />} />
        <Route path="financial/payments" element={<FinancialPage />} />
        <Route path="financial/invoices" element={<FinancialPage />} />
        <Route path="financial/analytics" element={<FinancialPage />} />
        
        {/* Rotas de Monitoramento */}
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="monitoring/performance" element={<MonitoringPage />} />
        <Route path="monitoring/logs" element={<MonitoringPage />} />
        <Route path="monitoring/alerts" element={<MonitoringPage />} />
        <Route path="monitoring/resources" element={<MonitoringPage />} />
        
        {/* Rotas de Usuários */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/admins" element={<UsersPage />} />
        <Route path="users/permissions" element={<UsersPage />} />
        
        {/* Rotas de Configurações */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/system" element={<SettingsPage />} />
        <Route path="settings/security" element={<SettingsPage />} />
        <Route path="settings/integrations" element={<SettingsPage />} />
        <Route path="settings/backup" element={<SettingsPage />} />
        
        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/admin-master" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminMasterRoutes;

