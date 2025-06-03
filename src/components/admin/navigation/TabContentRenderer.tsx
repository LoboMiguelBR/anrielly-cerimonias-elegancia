
import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load components
const DashboardTab = lazy(() => import('../tabs/DashboardTab'));
const ProposalsTab = lazy(() => import('../tabs/ProposalsTab'));
const ContractsTab = lazy(() => import('../tabs/ContractsTab'));
const ClientesTab = lazy(() => import('../tabs/ClientesTab'));
const LeadsTab = lazy(() => import('../tabs/LeadsTab'));
const EventsTab = lazy(() => import('../tabs/EventsTab'));
const ProfessionalsTab = lazy(() => import('../tabs/ProfessionalsTab'));
const ServicesTab = lazy(() => import('../tabs/ServicesTab'));
const GalleryTab = lazy(() => import('../tabs/AdminGalleryTab'));
const TestimonialsTab = lazy(() => import('../tabs/TestimonialsTab'));
const VendasFinanceiroTab = lazy(() => import('../tabs/VendasFinanceiroTab'));
const QuestionariosTab = lazy(() => import('../tabs/QuestionariosTab'));
const TemplatesTab = lazy(() => import('../tabs/TemplatesTab'));
const HistoriasCasaisTab = lazy(() => import('../tabs/HistoriasCasaisTab'));
const WebsiteTab = lazy(() => import('../tabs/WebsiteTab'));
const AnalyticsTab = lazy(() => import('../tabs/AnalyticsTab'));
const SettingsTab = lazy(() => import('../tabs/SettingsTab'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

interface TabContentRendererProps {
  activeTab: string;
}

const TabContentRenderer = ({ activeTab }: TabContentRendererProps) => {
  const renderTabContent = () => {
    const ComponentMap: Record<string, React.ComponentType> = {
      dashboard: DashboardTab,
      proposals: ProposalsTab,
      contracts: ContractsTab,
      clients: ClientesTab,
      leads: LeadsTab,
      events: EventsTab,
      professionals: ProfessionalsTab,
      services: ServicesTab,
      gallery: GalleryTab,
      testimonials: TestimonialsTab,
      'vendas-financeiro': VendasFinanceiroTab,
      questionarios: QuestionariosTab,
      templates: TemplatesTab,
      'historias-casais': HistoriasCasaisTab,
      website: WebsiteTab,
      analytics: AnalyticsTab,
      settings: SettingsTab,
    };

    const Component = ComponentMap[activeTab];
    
    if (!Component) {
      return (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Módulo não encontrado</h3>
            <p className="text-gray-600">O módulo solicitado não foi encontrado.</p>
          </CardContent>
        </Card>
      );
    }

    return <Component />;
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {renderTabContent()}
    </Suspense>
  );
};

export default TabContentRenderer;
