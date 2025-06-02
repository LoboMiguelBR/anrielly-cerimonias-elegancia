
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import EventsTab from '../tabs/EventsTab';
import CalendarioEventosTab from '../tabs/CalendarioEventosTab';
import ErrorBoundary from '../../ErrorBoundary';

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
        case "dashboard":
          return <DashboardTab onNavigate={handleNavigate} />;
        case "proposals":
          return <ProposalsMain quoteRequests={[]} />;
        case "contracts":
          return <ContractsMain />;
        case "questionarios":
          return <QuestionariosTab />;
        case "gestao-comercial":
          return <GestaoComercialTab />;
        case "events":
          return <EventsTab />;
        case "calendario-eventos":
          return <CalendarioEventosTab />;
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
