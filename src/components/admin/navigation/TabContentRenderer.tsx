
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
  const handleNavigate = (tab: string) => {
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
          console.warn(`Unknown tab: ${activeTab}, falling back to dashboard`);
          return <DashboardTab onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return <DashboardTab onNavigate={handleNavigate} />;
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
