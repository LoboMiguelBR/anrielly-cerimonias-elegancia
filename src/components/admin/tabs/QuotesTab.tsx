
import React, { useState } from 'react';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteDetail, QuotesTable } from '@/components/admin/quotes';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const QuotesTab = () => {
  const { data: quoteRequests, isLoading, error, mutate } = useQuoteRequests();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const { isMobile } = useMobileLayout();
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    // Update local data without refetching
    mutate(
      quoteRequests?.map(quote => 
        quote.id === id ? { ...quote, status: newStatus } : quote
      ),
      false
    );
  };

  const handleRefresh = () => {
    mutate();
  };

  const selectedQuoteData = quoteRequests?.find(quote => quote.id === selectedQuote);

  if (error) {
    return (
      <div className={`${isMobile ? 'p-2' : 'p-6'} bg-white rounded-lg shadow-sm`}>
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4`}>
          Gerenciar Solicitações de Orçamento
        </h2>
        <div className="p-4 bg-red-50 rounded border border-red-200 text-red-700">
          Erro ao carregar dados: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-2' : 'p-6'} bg-white rounded-lg shadow-sm min-h-screen`}>
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-4`}>
        {isMobile ? 'Solicitações' : 'Gerenciar Solicitações de Orçamento'}
      </h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <QuotesTable 
          quoteRequests={quoteRequests} 
          onViewDetails={setSelectedQuote}
          onRefresh={handleRefresh}
        />
      )}

      <QuoteDetail
        quoteRequest={selectedQuoteData}
        open={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default QuotesTab;
