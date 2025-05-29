
import React from 'react';
import ProposalsMain from '../proposals/ProposalsMain';
import { useMobileLayout } from '@/hooks/useMobileLayout';

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
  const { isMobile } = useMobileLayout();

  return (
    <div className="space-y-4 min-h-screen">
      <div className={`${isMobile ? 'p-2' : 'p-6'} bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200`}>
        <div className="mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-playfair font-semibold mb-2`}>
            {isMobile ? 'Propostas' : 'Gerenciamento de Propostas'}
          </h2>
          <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Crie e gerencie propostas personalizadas' 
              : 'Crie, edite e envie propostas personalizadas com o visual da sua marca para seus clientes.'
            }
          </p>
        </div>
        
        <ProposalsMain 
          quoteRequests={quoteRequests}
          quoteIdFromUrl={quoteIdFromUrl}
        />
      </div>
    </div>
  );
};

export default ProposalsTab;
