
import React from 'react';
import ProposalGenerator from '../proposals/ProposalGenerator';

interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

interface ProposalsTabProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
}

const ProposalsTab = ({ quoteRequests, quoteIdFromUrl }: ProposalsTabProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gerador de Propostas</h2>
      <p className="text-gray-500 mb-8">Crie propostas personalizadas para enviar aos clientes.</p>
      
      <ProposalGenerator 
        quoteRequests={quoteRequests} 
        quoteIdFromUrl={quoteIdFromUrl} 
      />
    </div>
  );
};

export default ProposalsTab;
