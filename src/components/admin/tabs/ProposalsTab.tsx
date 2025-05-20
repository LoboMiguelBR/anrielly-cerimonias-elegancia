
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
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200">
        <h2 className="text-2xl font-playfair font-semibold mb-2">Gerador de Propostas</h2>
        <p className="text-gray-500 mb-6">
          Crie propostas personalizadas com o visual da sua marca para enviar aos clientes.
        </p>
        
        <ProposalGenerator 
          quoteRequests={quoteRequests} 
          quoteIdFromUrl={quoteIdFromUrl} 
        />
      </div>
    </div>
  );
};

export default ProposalsTab;
