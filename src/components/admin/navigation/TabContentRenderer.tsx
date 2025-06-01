
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadsTab from '../tabs/LeadsTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import ClientesTab from '../tabs/ClientesTab';
import EventsTab from '../tabs/EventsTab';
import DashboardManager from '../dashboards/DashboardManager';
import QuotesTab from '../tabs/QuotesTab';
import GestaoComercialTab from '../tabs/GestaoComercialTab';
import AdminGalleryTab from '../tabs/AdminGalleryTab';
import TestimonialsTab from '../tabs/TestimonialsTab';
import HistoriasCasaisTab from '../tabs/HistoriasCasaisTab';
import ProposalTemplatesTab from '../tabs/ProposalTemplatesTab';
import ContractTemplatesTab from '../tabs/ContractTemplatesTab';
import ContractEmailTemplatesTab from '../tabs/ContractEmailTemplatesTab';
import SettingsTab from '../tabs/SettingsTab';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { useAuth } from '@/hooks/useAuth';

interface TabContentRendererProps {
  activeTab: string;
  quoteIdFromUrl?: string | null;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ 
  activeTab, 
  quoteIdFromUrl 
}) => {
  
  // Hook para obter dados dos quotes
  const { data: quoteRequests } = useQuoteRequests();
  const { profile } = useAuth();
  
  const renderTabContent = () => {
    console.log('TabContentRenderer - activeTab:', activeTab, 'profile:', profile?.role);
    
    switch (activeTab) {
      
      case 'dashboard':
        return <DashboardManager />;

      case 'leads':
        // Apenas admin pode ver leads
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <LeadsTab />;

      case 'quotes':
        return <QuotesTab />;

      case 'gestao-comercial':
        return <GestaoComercialTab />;

      case 'propostas':
        return <ProposalsMain 
          quoteRequests={quoteRequests || []} 
          quoteIdFromUrl={quoteIdFromUrl} 
        />;

      case 'contratos':
        return <ContractsMain />;

      case 'eventos':
        console.log('Rendering EventsTab...');
        try {
          return <EventsTab />;
        } catch (error) {
          console.error('Error rendering EventsTab:', error);
          return (
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Erro na Página de Eventos</h3>
                  <p className="text-gray-600 mb-4">
                    Ocorreu um erro ao carregar a página de eventos.
                  </p>
                  <p className="text-sm text-gray-500">
                    Verifique o console para mais detalhes.
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        }

      case 'questionarios':
        return <QuestionariosTab />;

      case 'clientes':
        // Apenas admin pode gerenciar clientes
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <ClientesTab />;

      case 'professionals':
        // Apenas admin pode gerenciar profissionais
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <ProfessionalsTab />;

      case 'gallery':
        return <AdminGalleryTab />;

      case 'testimonials':
        return <TestimonialsTab />;

      case 'historias-casais':
        return <HistoriasCasaisTab />;

      case 'proposal-templates':
        return <ProposalTemplatesTab />;

      case 'contract-templates':
        return <ContractTemplatesTab />;

      case 'contract-email-templates':
        return <ContractEmailTemplatesTab />;

      case 'settings':
        return <SettingsTab />;
      
      default:
        return <DashboardManager />;
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;
