
import React from 'react';
import DashboardTab from '../tabs/DashboardTab';
import LeadsTab from '../tabs/LeadsTab';
import QuotesTab from '../tabs/QuotesTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import EventosTab from '../tabs/EventsTab';
import CalendarioEventosTab from '../tabs/EventsTab';
import ClientesTab from '../tabs/ClientesTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import ServicesTab from '../tabs/ServicesTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import VendasFinanceiroTab from '../tabs/VendasFinanceiroTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import ProposalTemplatesTab from '../tabs/ProposalTemplatesTab';
import ContractTemplatesTab from '../tabs/ContractTemplatesTab';
import ContractEmailTemplatesTab from '../tabs/ContractEmailTemplatesTab';
import WebsiteTab from '../tabs/WebsiteTab';
import LandingPagesTab from '../tabs/LandingPagesTab';
import AnalyticsTab from '../tabs/AnalyticsTab';
import SettingsTab from '../tabs/SettingsTab';
import UsersTab from '../tabs/UsersTab';
import TemplatesTab from '../tabs/TemplatesTab';
import CMSHomeTab from '../tabs/CMSHomeTab';
import { TabContentRendererProps } from './types';

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ activeTab }) => {
  const tabComponents: Record<string, React.ComponentType> = {
    dashboard: DashboardTab,
    leads: LeadsTab,
    quotes: QuotesTab,
    proposals: ProposalsTab,
    contracts: ContractsTab,
    events: EventosTab,
    'calendario-eventos': CalendarioEventosTab,
    clients: ClientesTab,
    professionals: ProfessionalsTab,
    services: ServicesTab,
    'cms-home': CMSHomeTab,
    gallery: AdminGalleryTab,
    testimonials: TestimonialsTab,
    'vendas-financeiro': VendasFinanceiroTab,
    'gestao-comercial': GestaoComercialTab,
    questionarios: QuestionariosTab,
    'historias-casais': HistoriasCasaisTab,
    'proposal-templates': ProposalTemplatesTab,
    'contract-templates': ContractTemplatesTab,
    'contract-email-templates': ContractEmailTemplatesTab,
    website: WebsiteTab,
    'landing-pages': LandingPagesTab,
    analytics: AnalyticsTab,
    settings: SettingsTab,
    users: UsersTab,
    templates: TemplatesTab
  };

  const TabComponent = tabComponents[activeTab] || (() => <div className="p-4">Conteúdo não encontrado</div>);

  return (
    <div className="h-full">
      <TabComponent />
    </div>
  );
};

export default TabContentRenderer;
