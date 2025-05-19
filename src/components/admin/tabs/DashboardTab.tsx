
import React from 'react';
import DashboardSummary from '../DashboardSummary';
import QuoteRequestsTable from '../QuoteRequestsTable';

interface DashboardTabProps {
  quoteRequests: Array<{
    id: number;
    name: string;
    date: string;
    eventType: string;
    phone: string;
    status: string;
    email: string;
    eventLocation: string;
  }>;
}

const DashboardTab = ({ quoteRequests }: DashboardTabProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Resumo Geral</h2>
      <DashboardSummary 
        quoteRequestsCount={quoteRequests.length}
        proposalsCount={0}
        galleryCount={8}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Orçamentos Recentes</h3>
        <QuoteRequestsTable quoteRequests={quoteRequests} />
      </div>
    </div>
  );
};

export default DashboardTab;
