
import React from 'react';
import { QuoteRequest } from '../hooks/useProposalForm';

interface ClientSelectionProps {
  quoteRequests: QuoteRequest[];
  selectedQuote: string;
  handleQuoteSelect: (id: string) => void;
  isLoading: boolean;
}

const ClientSelection: React.FC<ClientSelectionProps> = ({
  quoteRequests,
  selectedQuote,
  handleQuoteSelect,
  isLoading
}) => {
  const selectedQuoteData = quoteRequests.find(quote => quote.id === selectedQuote);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
      <select 
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
        value={selectedQuote}
        onChange={(e) => handleQuoteSelect(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Selecione um cliente</option>
        {quoteRequests.map(request => (
          <option key={request.id} value={request.id}>
            {request.name} - {request.event_type || request.eventType}
          </option>
        ))}
      </select>
      
      {selectedQuote && selectedQuoteData && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
          <p><strong>Email:</strong> {selectedQuoteData.email}</p>
          <p><strong>Telefone:</strong> {selectedQuoteData.phone}</p>
          <p><strong>Data do evento:</strong> {selectedQuoteData.event_date ? new Date(selectedQuoteData.event_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
          <p><strong>Local:</strong> {selectedQuoteData.event_location}</p>
        </div>
      )}
    </div>
  );
};

export default ClientSelection;
