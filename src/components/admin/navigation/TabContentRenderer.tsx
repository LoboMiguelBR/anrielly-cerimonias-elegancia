
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import QuotesTab from '../tabs/QuotesTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import LeadsTab from '../tabs/LeadsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import EventsTab from '../tabs/EventsTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import ProposalTemplatesTab from '../tabs/ProposalTemplatesTab';
import ContractTemplatesTab from '../tabs/ContractTemplatesTab';
import ContractEmailTemplatesTab from '../tabs/ContractEmailTemplatesTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import LandingPagesTab from '../tabs/LandingPagesTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'quotes':
        return <QuotesTab />;
      case 'proposals':
        return <ProposalsTab />;
      case 'contracts':
        return <ContractsTab />;
      case 'leads':
        return <LeadsTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'events':
        return <EventsTab />;
      case 'questionarios':
        return <QuestionariosTab />;
      case 'historias-casais':
        return <HistoriasCasaisTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'gallery':
        return <AdminGalleryTab />;
      case 'proposal-templates':
        return <ProposalTemplatesTab />;
      case 'contract-templates':
        return <ContractTemplatesTab />;
      case 'contract-email-templates':
        return <ContractEmailTemplatesTab />;
      case 'gestao-comercial':
        return <GestaoComercialTab />;
      case 'landing-pages':
        return <LandingPagesTab />;
      default:
        return <DashboardTab />;
    }
  };

  return <>{renderTabContent()}</>;
};

export default TabContentRenderer;
