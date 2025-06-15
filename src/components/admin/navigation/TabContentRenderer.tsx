import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import EventsTab from '../tabs/EventsTab';
import CalendarioEventosTab from '../tabs/CalendarioEventosTab';
import TemplatesTab from '../tabs/TemplatesTab';
import QuotesTab from '../tabs/QuotesTab';
import LeadsTab from '../tabs/LeadsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import UsersTab from '../tabs/UsersTab';
import ErrorBoundary from '../../ErrorBoundary';
import { ClientesTab } from '../tabs';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  // Verificação de segurança para props
  if (!activeTab || typeof activeTab !== 'string') {
    console.warn('TabContentRenderer: Invalid activeTab', activeTab);
    return (
      <ErrorBoundary>
        <div className="w-full p-4">
          <div className="text-center text-gray-500">
            <p>Erro: Tab não especificada</p>
            <p className="text-sm">Por favor, selecione uma aba válida</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const handleNavigate = (tab: string) => {
    if (!tab || typeof tab !== 'string') {
      console.warn('TabContentRenderer: Invalid navigation tab', tab);
      return;
    }
    console.log('Navigate to:', tab);
  };

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        // Principal
        case "dashboard":
          return <DashboardTab onNavigate={handleNavigate} />;
        // CRM & Vendas
        case "leads":
          return <LeadsTab />;
        case "gestao-comercial":
          return <GestaoComercialTab />;
        case "quotes":
          return <QuotesTab />;
        case "proposals":
          return <ProposalsMain quoteRequests={[]} />;
        case "contracts":
          return <ContractsMain />;
        case "clientes":
          return <ClientesTab />;
        // Operacional
        case "events":
          return <EventsTab />;
        case "calendario-eventos":
          return <CalendarioEventosTab />;
        case "questionarios":
          return <QuestionariosTab />;
        case "fornecedores":
          return (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Fornecedores</h2>
              <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
            </div>
          );
        case "professionals":
          return <ProfessionalsTab />;
        // Conteúdo
        case "gallery":
          return <AdminGalleryTab />;
        case "testimonials":
          return <TestimonialsTab />;
        // Sistema
        case "templates":
          return <TemplatesTab />;
        case "users":
          return <UsersTab />;
        case "settings":
          return (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Configurações</h2>
              <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
            </div>
          );
        default:
          console.warn(`TabContentRenderer: Unknown tab: ${activeTab}, falling back to dashboard`);
          return <DashboardTab onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('TabContentRenderer: Error rendering tab content:', error);
      return (
        <div className="w-full p-4">
          <div className="text-center text-red-500">
            <p>Erro ao carregar conteúdo da aba</p>
            <p className="text-sm">Tab: {activeTab}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full">
        {renderTabContent()}
      </div>
    </ErrorBoundary>
  );
};

export default TabContentRenderer;
