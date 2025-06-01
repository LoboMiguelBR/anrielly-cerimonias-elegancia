
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadsTab from '../tabs/LeadsTab';
import ProposalsMain from '../proposals/ProposalsMain';
import ContractsMain from '../contracts/ContractsMain';
import QuestionariosTab from '../tabs/QuestionariosTab';
import ProfessionalsTab from '../tabs/ProfessionalsTab';
import ClientesTab from '../tabs/ClientesTab';
import EventsTab from '../tabs/EventsTab';

interface TabContentRendererProps {
  activeTab: string;
  quoteRequests: any[];
  quoteIdFromUrl?: string | null;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ 
  activeTab, 
  quoteRequests, 
  quoteIdFromUrl 
}) => {
  
  const DashboardSummary = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quoteRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Aguardando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quoteRequests.filter(q => q.status === 'aguardando').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Convertidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quoteRequests.filter(q => q.status === 'convertido').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quoteRequests.length > 0 
                ? Math.round((quoteRequests.filter(q => q.status === 'convertido').length / quoteRequests.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      
      case 'dashboard':
        return <DashboardSummary />;

      case 'leads':
        return <LeadsTab />;

      case 'propostas':
        return <ProposalsMain 
          quoteRequests={quoteRequests} 
          quoteIdFromUrl={quoteIdFromUrl} 
        />;

      case 'contratos':
        return <ContractsMain />;

      case 'questionarios':
        return <QuestionariosTab />;

      case 'professionals':
        return <ProfessionalsTab />;
        
      case 'clientes':
        return <ClientesTab />;
        
      case 'eventos':
        return <EventsTab />;
      
      
      default:
        return <DashboardSummary />;
    }
  };

  return renderTabContent();
};

export default TabContentRenderer;
