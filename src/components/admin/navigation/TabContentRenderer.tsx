
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import QuotesTab from '../tabs/QuotesTab';
import ProposalsTab from '../tabs/ProposalsTab';
import EventsTab from '../tabs/EventsTab';
import ContractsTab from '../tabs/ContractsTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import LeadsTab from '../tabs/LeadsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import ProposalTemplatesTab from '../tabs/ProposalTemplatesTab';
import ContractTemplatesTab from '../tabs/ContractTemplatesTab';
import ContractEmailTemplatesTab from '../tabs/ContractEmailTemplatesTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ activeTab }) => {
  const handleNavigate = (tab: string) => {
    // This would be handled by the parent component
    console.log('Navigate to:', tab);
  };

  switch (activeTab) {
    case 'dashboard':
      return <DashboardTab onNavigate={handleNavigate} />;
    case 'quotes':
      return <QuotesTab />;
    case 'proposals':
      return <ProposalsTab quoteRequests={[]} />;
    case 'events':
      return <EventsTab />;
    case 'contracts':
      return <ContractsTab />;
    case 'questionarios':
      return <QuestionariosTab />;
    case 'historias-casais':
      return <HistoriasCasaisTab />;
    case 'leads':
      return <LeadsTab />;
    case 'professionals':
      return <ProfessionalsTab />;
    case 'gallery':
      return <AdminGalleryTab />;
    case 'testimonials':
      return <TestimonialsTab />;
    case 'gestao-comercial':
      return <GestaoComercialTab />;
    case 'proposal-templates':
      return <ProposalTemplatesTab />;
    case 'contract-templates':
      return <ContractTemplatesTab />;
    case 'contract-email-templates':
      return <ContractEmailTemplatesTab />;
    default:
      return <DashboardTab onNavigate={handleNavigate} />;
  }
};

export default TabContentRenderer;
