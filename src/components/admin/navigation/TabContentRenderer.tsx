import React from 'react';
import DashboardSummary from '../dashboard/DashboardSummary';
import LeadsTab from '../tabs/LeadsTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import ClientesTab from '../tabs/ClientesTab';
import EventsTab from '../tabs/EventsTab';

interface TabContentRendererProps {
  activeTab: string;
  quoteRequests: any[];
  quoteIdFromUrl?: string | null;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ 
  activeTab, 
  quoteRequests, 
  quoteIdFromUrl 
}) => {
  
  const renderTabContent = () => {
    switch (activeTab) {
      
      case 'dashboard':
        return <DashboardSummary />;

      case 'leads':
        return <LeadsTab />;

      case 'propostas':
        return <ProposalsMain 
          quoteRequests={quoteRequests} 
          quoteIdFromUrl={quoteIdFromUrl} 
        />;

      case 'contratos':
        return <ContractsMain />;

      case 'questionarios':
        return <QuestionariosTab />;

      case 'professionals':
        return <ProfessionalsTab />;
        
      case 'clientes':
        return <ClientesTab />;
        
      case 'eventos':
        return <EventsTab />;
      
      
      default:
        return <DashboardSummary />;
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;
