
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
    switch (activeTab) {
      
      case 'dashboard':
        return <DashboardManager />;

      case 'leads':
        // Apenas admin pode ver leads
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <LeadsTab />;

      case 'propostas':
        return <ProposalsMain 
          quoteRequests={quoteRequests || []} 
          quoteIdFromUrl={quoteIdFromUrl} 
        />;

      case 'contratos':
        return <ContractsMain />;

      case 'questionarios':
        return <QuestionariosTab />;

      case 'professionals':
        // Apenas admin pode gerenciar profissionais
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <ProfessionalsTab />;
        
      case 'clientes':
        // Apenas admin pode gerenciar clientes
        if (profile?.role !== 'admin') {
          return <div className="text-center py-8 text-gray-500">Acesso restrito</div>;
        }
        return <ClientesTab />;
        
      case 'eventos':
        return <EventsTab />;
      
      default:
        return <DashboardManager />;
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;
