
import React, { useState } from 'react';
import { useProposalForm } from '../hooks/proposal';
import { toast } from 'sonner';
import ProposalPreview from './ProposalPreview';
import { ProposalData } from '../hooks/proposal';
import GeneratorHeader from './generator/GeneratorHeader';
import GeneratorFooter from './generator/GeneratorFooter';
import ProposalForm from './generator/ProposalForm';
import GeneratorLoadingState from './generator/GeneratorLoadingState';

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

  // Debugging logs
  console.log("ProposalGenerator rendering, formData:", formData);
  console.log("showPreview:", showPreview, "proposal:", proposal);

  const handleGeneratePDF = async () => {
    try {
      // Validate required data before attempting to save
      if (!formData.client_name || !formData.client_name.trim()) {
        toast.error("Nome do cliente é obrigatório");
        return;
      }

      if (!formData.services || formData.services.filter(s => s.included).length === 0) {
        toast.error("Selecione pelo menos um serviço");
        return;
      }

      if (!formData.total_price || parseFloat(formData.total_price) <= 0) {
        toast.error("Valor total deve ser maior que zero");
        return;
      }
      
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
        template_id: selectedTemplate.id !== 'default' ? selectedTemplate.id : null
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

  const handleDelete = async () => {
    if (!isEditMode || !initialProposalId) {
      toast.error("Esta proposta não pode ser excluída");
      return;
    }
    
    const success = await deleteProposal();
    
    if (success) {
      toast.success("Proposta excluída com sucesso");
      if (onClose) onClose();
    } else {
      toast.error("Erro ao excluir proposta");
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

  if (isLoading) {
    return <GeneratorLoadingState />;
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
      <GeneratorHeader 
        isEditMode={isEditMode}
        templateId={formData.template_id}
        onTemplateChange={setSelectedTemplate}
      />
      
      <ProposalForm
        quoteRequests={quoteRequests}
        selectedQuote={selectedQuote}
        formData={formData}
        isEditMode={isEditMode}
        isLoading={isLoading}
        handleQuoteSelect={handleQuoteSelect}
        handleFormChange={handleFormChange}
        handleServiceChange={handleServiceChange}
        handleCustomServiceAdd={handleCustomServiceAdd}
      />
      
      <GeneratorFooter 
        onClose={onClose}
        onSendEmail={handleSendEmail}
        onGeneratePDF={handleGeneratePDF}
        onDelete={isEditMode ? handleDelete : undefined}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isSending={isSending}
        generatingPDF={generatingPDF}
        hasPdfUrl={!!proposal?.pdf_url}
        hasSelectedQuote={!!selectedQuote}
      />
    </div>
  );
};

export default ProposalGenerator;
