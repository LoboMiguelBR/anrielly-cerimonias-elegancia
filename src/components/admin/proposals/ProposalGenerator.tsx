
import React, { useEffect } from 'react';
import { useProposalForm, ProposalData } from '../hooks/useProposalForm';
import ClientSelection from './ClientSelection';
import ServicesSection from './ServicesSection';
import PriceSection from './PriceSection';
import NotesSection from './NotesSection';
import ValidityDateSection from './ValidityDateSection';
import ActionButtons from './ActionButtons';

// Define the expected structure for the PDF proposal data
interface ProposalPDFData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  services: Array<{ name: string; included: boolean }>;
  total_price: number;
  payment_terms: string;
  notes: string | null;
  validity_date: string;
  created_at: string;
  quote_request_id: string | null;
}

interface ProposalGeneratorProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    eventType?: string;
    event_type?: string;
    email?: string;
    phone?: string;
    event_date?: string;
    event_location?: string;
  }>;
  quoteIdFromUrl?: string | null;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ 
  quoteRequests,
  quoteIdFromUrl
}) => {
  const {
    selectedQuote,
    isLoading,
    isSaving,
    generatingPDF,
    proposal,
    formData,
    setSelectedQuote,
    setGeneratingPDF,
    setProposal,
    setFormData,
    handleQuoteSelect,
    handleServiceChange,
    handleCustomServiceAdd,
    saveProposal
  } = useProposalForm(quoteIdFromUrl);

  // Fill form with selected quote details
  useEffect(() => {
    if (quoteIdFromUrl) {
      const selectedRequest = quoteRequests.find(quote => quote.id === quoteIdFromUrl);
      if (selectedRequest) {
        setSelectedQuote(selectedRequest.id);
      }
    }
  }, [quoteIdFromUrl, quoteRequests, setSelectedQuote]);

  // Update form when a quote is selected
  useEffect(() => {
    if (selectedQuote) {
      const selectedRequest = quoteRequests.find(quote => quote.id === selectedQuote);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          client_name: selectedRequest.name || "",
          client_email: selectedRequest.email || "",
          client_phone: selectedRequest.phone || "",
          event_type: selectedRequest.event_type || selectedRequest.eventType || "",
          event_date: selectedRequest.event_date || null,
          event_location: selectedRequest.event_location || "",
          quote_request_id: selectedRequest.id
        }));
      }
    }
  }, [selectedQuote, quoteRequests, setFormData]);

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      
      // First save the proposal in the database
      const proposalId = await saveProposal();
      
      if (!proposalId) {
        throw new Error('Não foi possível salvar a proposta');
      }
      
      // Create complete proposal object for the PDF
      const proposalForPDF: ProposalPDFData = {
        id: proposalId,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_location: formData.event_location,
        services: formData.services.filter(s => s.included),
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms,
        notes: formData.notes || null,
        validity_date: formData.validity_date,
        created_at: new Date().toISOString(),
        quote_request_id: formData.quote_request_id
      };
      
      setProposal(proposalForPDF as ProposalData);
      
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-medium mb-6 text-lg">Nova Proposta</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClientSelection 
            quoteRequests={quoteRequests}
            selectedQuote={selectedQuote}
            handleQuoteSelect={handleQuoteSelect}
            isLoading={isLoading}
          />
          
          <ValidityDateSection 
            validityDate={formData.validity_date}
            handleValidityDateChange={(value) => setFormData({...formData, validity_date: value})}
            isLoading={isLoading}
          />
        </div>
        
        <ServicesSection 
          services={formData.services}
          customService={formData.customService}
          handleServiceChange={handleServiceChange}
          handleCustomServiceChange={(value) => setFormData({...formData, customService: value})}
          handleCustomServiceAdd={handleCustomServiceAdd}
          isLoading={isLoading}
        />
        
        <PriceSection 
          totalPrice={formData.total_price}
          paymentTerms={formData.payment_terms}
          handlePriceChange={(value) => setFormData({...formData, total_price: value})}
          handlePaymentTermsChange={(value) => setFormData({...formData, payment_terms: value})}
          isLoading={isLoading}
        />
        
        <NotesSection 
          notes={formData.notes}
          handleNotesChange={(value) => setFormData({...formData, notes: value})}
          isLoading={isLoading}
        />
        
        <ActionButtons 
          isSaving={isSaving}
          generatingPDF={generatingPDF}
          selectedQuote={selectedQuote}
          onSave={saveProposal}
          onGeneratePDF={handleGeneratePDF}
          proposal={proposal}
        />
      </div>
    </div>
  );
};

export default ProposalGenerator;
