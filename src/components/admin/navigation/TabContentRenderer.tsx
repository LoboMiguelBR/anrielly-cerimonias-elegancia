
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import LeadsTab from '../tabs/LeadsTab';
import ClientsTab from '../tabs/ClientsTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import EventsTab from '../tabs/EventsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import GalleryTab from '../tabs/GalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import SystemSettingsTab from '../tabs/SystemSettingsTab';
import TemplatePropostasTab from '../tabs/TemplatePropostasTab';
import TemplateContratosTab from '../tabs/TemplateContratosTab';
import TemplateEmailsTab from '../tabs/TemplateEmailsTab';
import UsersTab from '../tabs/UsersTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'leads':
        return <LeadsTab />;
      case 'clients':
        return <ClientsTab />;
      case 'proposals':
        return <ProposalsTab />;
      case 'contracts':
        return <ContractsTab />;
      case 'events':
        return <EventsTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'gestao-comercial':
        return <GestaoComercialTab />;
      case 'gallery':
        return <GalleryTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'questionarios':
        return <QuestionariosTab />;
      case 'historias-casais':
        return <HistoriasCasaisTab />;
      case 'template-propostas':
        return <TemplatePropostasTab />;
      case 'template-contratos':
        return <TemplateContratosTab />;
      case 'template-emails':
        return <TemplateEmailsTab />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderTabContent()}
    </div>
  );
};

export default TabContentRenderer;
