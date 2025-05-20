import React, { useState } from 'react';
import { useProposalForm } from '../hooks/proposal';
import ClientSelection from './ClientSelection';
import ServicesSection from './ServicesSection';
import PriceSection from './PriceSection';
import NotesSection from './NotesSection';
import ValidityDateSection from './ValidityDateSection';
import ActionButtons from './ActionButtons';
import ProposalPreview from './ProposalPreview';
import { ProposalData } from '../hooks/proposal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  initialProposalId?: string;
  onClose?: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ 
  quoteRequests,
  quoteIdFromUrl,
  initialProposalId,
  onClose
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    selectedQuote,
    isLoading,
    isSaving,
    isDeleting,
    generatingPDF,
    proposal,
    formData,
    isEditMode,
    setSelectedQuote,
    setGeneratingPDF,
    setProposal,
    setFormData,
    handleQuoteSelect,
    handleFormChange,
    handleServiceChange,
    handleCustomServiceAdd,
    saveProposal,
    deleteProposal
  } = useProposalForm(initialProposalId, quoteIdFromUrl);

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      
      // First save the proposal in the database
      const proposalId = await saveProposal();
      
      if (!proposalId) {
        throw new Error('Não foi possível salvar a proposta');
      }
      
      // Create complete proposal object for the PDF
      const proposalForPDF: ProposalData = {
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
      
      setProposal(proposalForPDF);
      setShowPreview(true);
      
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
    if (onClose) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
        <p className="mt-2 text-gray-500">Carregando dados da proposta...</p>
      </div>
    );
  }

  if (showPreview && proposal) {
    return <ProposalPreview proposal={proposal} onBack={handleBackFromPreview} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientSelection 
          quoteRequests={quoteRequests}
          selectedQuote={selectedQuote}
          handleQuoteSelect={handleQuoteSelect}
          isLoading={isLoading}
          disabled={isEditMode}
        />
        
        <ValidityDateSection 
          validityDate={formData.validity_date}
          handleValidityDateChange={(value) => handleFormChange('validity_date', value)}
          isLoading={isLoading}
        />
      </div>
      
      <ServicesSection 
        services={formData.services}
        customService={formData.customService}
        handleServiceChange={handleServiceChange}
        handleCustomServiceChange={(value) => handleFormChange('customService', value)}
        handleCustomServiceAdd={handleCustomServiceAdd}
        isLoading={isLoading}
      />
      
      <PriceSection 
        totalPrice={formData.total_price}
        paymentTerms={formData.payment_terms}
        handlePriceChange={(value) => handleFormChange('total_price', value)}
        handlePaymentTermsChange={(value) => handleFormChange('payment_terms', value)}
        isLoading={isLoading}
      />
      
      <NotesSection 
        notes={formData.notes}
        handleNotesChange={(value) => handleFormChange('notes', value)}
        isLoading={isLoading}
      />
      
      <div className="flex flex-wrap gap-3 justify-end mt-6">
        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isSaving || generatingPDF || isDeleting}
          >
            Cancelar
          </Button>
        )}
        
        <ActionButtons 
          isSaving={isSaving}
          generatingPDF={generatingPDF}
          selectedQuote={selectedQuote}
          onSave={saveProposal}
          onGeneratePDF={handleGeneratePDF}
          proposal={proposal}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default ProposalGenerator;
