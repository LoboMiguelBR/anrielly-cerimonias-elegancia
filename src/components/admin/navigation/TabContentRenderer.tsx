
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import EventsTab from '../tabs/EventsTab';
import CalendarioEventosTab from '../tabs/CalendarioEventosTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const handleNavigate = (tab: string) => {
    // Navigation logic can be implemented here if needed
    console.log('Navigate to:', tab);
  };

  const renderTabContent = () => {
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
        return <DashboardTab onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full">
      {renderTabContent()}
    </div>
  );
};

export default TabContentRenderer;
