import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuoteRequestsMain from '../quote-requests/QuoteRequestsMain';
import QuestionnairesMain from '../questionnaires/QuestionnairesMain';
import TemplatesMain from '../templates/TemplatesMain';
import ProfessionalsMain from '../professionals/ProfessionalsMain';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import EventsTab from '../tabs/EventsTab';
import CalendarioEventosTab from '../tabs/CalendarioEventosTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "proposals":
        return <ProposalsMain quoteRequests={[]} />;
      case "contracts":
        return <ContractsMain />;
      case "quote-requests":
        return <QuoteRequestsMain />;
      case "questionnaires":
        return <QuestionnairesMain />;
      case "templates":
        return <TemplatesMain />;
      case "professionals":
        return <ProfessionalsMain />;
      case "gestao-comercial":
        return <GestaoComercialTab />;
      case "events":
        return <EventsTab />;
      case "calendario-eventos":
        return <CalendarioEventosTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="w-full">
      {renderTabContent()}
    </div>
  );
};

export default TabContentRenderer;
