
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import LeadsTab from '../tabs/LeadsTab';
import ClientesTab from '../tabs/ClientesTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import EventsTab from '../tabs/EventsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import SystemSettingsTab from '../tabs/SystemSettingsTab';
import ProposalTemplatesTab from '../tabs/ProposalTemplatesTab';
import ContractTemplatesTab from '../tabs/ContractTemplatesTab';
import ContractEmailTemplatesTab from '../tabs/ContractEmailTemplatesTab';
import UsersTab from '../tabs/UsersTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import CalendarioEventosTab from '../tabs/CalendarioEventosTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab onNavigate={() => {}} />;
      case 'leads':
        return <LeadsTab />;
      case 'clients':
        return <ClientesTab />;
      case 'proposals':
        return <ProposalsTab quoteRequests={[]} />;
      case 'contracts':
        return <ContractsTab />;
      case 'events':
        return <EventsTab />;
      case 'calendario-eventos':
        return <CalendarioEventosTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'gestao-comercial':
        return <GestaoComercialTab />;
      case 'gallery':
        return <AdminGalleryTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'questionarios':
        return <QuestionariosTab />;
      case 'historias-casais':
        return <HistoriasCasaisTab />;
      case 'template-propostas':
        return <ProposalTemplatesTab />;
      case 'template-contratos':
        return <ContractTemplatesTab />;
      case 'template-emails':
        return <ContractEmailTemplatesTab />;
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SystemSettingsTab />;
      default:
        return <DashboardTab onNavigate={() => {}} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderTabContent()}
    </div>
  );
};

export default TabContentRenderer;
