
import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, Loader2, FileText, Mail } from 'lucide-react';
import TemplateSelector from './templates/TemplateSelector';
import { ProposalTemplateData } from './templates/shared/types';
import { toast } from 'sonner';

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
    isSending,
    generatingPDF,
    proposal,
    formData,
    isEditMode,
    selectedTemplate,
    setSelectedQuote,
    setGeneratingPDF,
    setProposal,
    setFormData,
    setSelectedTemplate,
    handleQuoteSelect,
    handleFormChange,
    handleServiceChange,
    handleCustomServiceAdd,
    saveProposal,
    deleteProposal,
    sendProposalEmail,
    saveProposalPdfUrl
  } = useProposalForm(initialProposalId, quoteIdFromUrl, quoteRequests);

  // Log para depurar o fluxo
  console.log("ProposalGenerator rendering, formData:", formData);
  console.log("showPreview:", showPreview, "proposal:", proposal);

  const handleGeneratePDF = async () => {
    try {
      console.log("Generating PDF, formData:", formData);
      setGeneratingPDF(true);
      
      // First save the proposal in the database
      const proposalId = await saveProposal();
      
      if (!proposalId) {
        throw new Error('Não foi possível salvar a proposta');
      }
      
      console.log("Proposal saved with ID:", proposalId);
      
      // Create complete proposal object for the PDF
      const proposalForPDF: ProposalData = {
        id: proposalId,
        client_name: formData.client_name || "Cliente",
        client_email: formData.client_email || "",
        client_phone: formData.client_phone || "",
        event_type: formData.event_type || "Evento",
        event_date: formData.event_date,
        event_location: formData.event_location || "",
        services: formData.services.filter(s => s.included),
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms || "",
        notes: formData.notes || null,
        validity_date: formData.validity_date,
        created_at: new Date().toISOString(),
        quote_request_id: formData.quote_request_id,
        template_id: selectedTemplate.id !== 'default' ? selectedTemplate.id : undefined
      };
      
      console.log("Created proposalForPDF:", proposalForPDF);
      
      setProposal(proposalForPDF);
      setShowPreview(true);
      
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast.error(`Erro ao gerar PDF: ${error.message}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSendEmail = async () => {
    if (!proposal) {
      toast.error("Nenhuma proposta para enviar");
      return;
    }

    if (!proposal.pdf_url) {
      toast.error("É necessário gerar o PDF antes de enviar por email");
      return;
    }
    
    const success = await sendProposalEmail();
    if (success) {
      toast.success(`Proposta enviada para ${proposal.client_email}`);
    }
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  const handlePdfGenerated = async (pdfUrl: string) => {
    if (proposal?.id) {
      await saveProposalPdfUrl(pdfUrl);
    }
  };

  const handleTemplateChange = (template: ProposalTemplateData) => {
    setSelectedTemplate(template);
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
    console.log("Showing preview for proposal:", proposal);
    return (
      <ProposalPreview 
        proposal={proposal} 
        template={selectedTemplate} 
        onBack={handleBackFromPreview} 
        onPdfGenerated={handlePdfGenerated}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-medium mb-4">
          {isEditMode ? 'Editar Proposta' : 'Nova Proposta'}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Template da Proposta</label>
          <TemplateSelector 
            selectedTemplateId={formData.template_id || 'default'} 
            onSelectTemplate={handleTemplateChange}
          />
        </div>
      </div>
      
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
      
      <div className="flex flex-wrap gap-3 justify-end mt-6 border-t pt-6">
        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isSaving || generatingPDF || isDeleting || isSending}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        )}
        
        <Button 
          onClick={handleSendEmail}
          disabled={isSending || !proposal?.pdf_url}
          variant="outline"
        >
          {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
          Enviar por Email
        </Button>
        
        <Button 
          onClick={handleGeneratePDF} 
          disabled={generatingPDF || !selectedQuote}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
          Visualizar Proposta
        </Button>
      </div>
    </div>
  );
};

export default ProposalGenerator;
