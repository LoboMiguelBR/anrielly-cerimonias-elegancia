
import { Card, CardContent } from '@/components/ui/card';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';

// Import components directly instead of lazy loading to avoid 404 errors
import DashboardTab from '../tabs/DashboardTab';
import ProposalsTab from '../tabs/ProposalsTab';
import ContractsTab from '../tabs/ContractsTab';
import ClientesTab from '../tabs/ClientesTab';
import LeadsTab from '../tabs/LeadsTab';
import EventsTab from '../tabs/EventsTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import ServicesTab from '../tabs/ServicesTab';
import GalleryTab from '../tabs/AdminGalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import VendasFinanceiroTab from '../tabs/VendasFinanceiroTab';
import QuestionariosTab from '../tabs/QuestionariosTab';
import TemplatesTab from '../tabs/TemplatesTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import WebsiteTab from '../tabs/WebsiteTab';
import AnalyticsTab from '../tabs/AnalyticsTab';
import SettingsTab from '../tabs/SettingsTab';

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const { data: quoteRequests = [] } = useQuoteRequests();

  const handleNavigate = (tab: string) => {
    console.log('Navigate to tab:', tab);
    // Esta função será implementada pelo componente pai se necessário
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab onNavigate={handleNavigate} />;
      case 'proposals':
        return <ProposalsTab quoteRequests={quoteRequests} quoteIdFromUrl={null} />;
      case 'contracts':
        return <ContractsTab />;
      case 'clients':
        return <ClientesTab />;
      case 'leads':
        return <LeadsTab />;
      case 'events':
        return <EventsTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'services':
        return <ServicesTab />;
      case 'gallery':
        return <GalleryTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'vendas-financeiro':
        return <VendasFinanceiroTab />;
      case 'questionarios':
        return <QuestionariosTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'historias-casais':
        return <HistoriasCasaisTab />;
      case 'website':
        return <WebsiteTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Módulo não encontrado</h3>
              <p className="text-gray-600">O módulo solicitado não foi encontrado.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;
