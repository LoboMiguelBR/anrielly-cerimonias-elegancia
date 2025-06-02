import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import LeadsTab from '../tabs/LeadsTab';
import QuotesTab from '../tabs/QuotesTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import EventsTab from '../tabs/EventsTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import TemplatesTab from '../tabs/TemplatesTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import LandingPagesTab from '../tabs/LandingPagesTab';
import UsersTab from '../tabs/UsersTab';

const TabContentRenderer = ({ activeTab }: { activeTab: string }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'gestao-comercial':
        return <GestaoComercialTab />;
      case 'leads':
        return <LeadsTab />;
      case 'quotes':
        return <QuotesTab />;
      case 'proposals':
        return <ProposalsTab />;
      case 'contracts':
        return <ContractsTab />;
      case 'events':
        return <EventsTab />;
      case 'questionarios':
        return <QuestionariosTab />;
      case 'historias-casais':
        return <HistoriasCasaisTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'gallery':
        return <AdminGalleryTab />;
      case 'landing-pages':
        return <LandingPagesTab />;
      case 'users':
        return <UsersTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      {renderTabContent()}
    </div>
  );
};

export default TabContentRenderer;
