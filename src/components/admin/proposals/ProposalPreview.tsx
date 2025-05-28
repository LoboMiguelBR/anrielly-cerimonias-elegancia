
import React, { useState, useEffect } from 'react';
import { PDFPreviewContent, PDFHeader, PDFTabs, proposalUtils } from './preview';
import { ProposalData } from '../hooks/proposal';
import { ProposalTemplateData } from './templates/shared/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import HtmlProposalRenderer from './templates/HtmlProposalRenderer';
import { ProposalHelper } from '../pdf/utils/ProposalHelper';

interface ProposalPreviewProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onBack: () => void;
  onPdfGenerated?: (pdfUrl: string) => Promise<void>;
}

// Default template inline
const defaultTemplate: ProposalTemplateData = {
  id: 'default',
  name: 'Template Padrão',
  colors: {
    primary: '#8A2BE2',
    secondary: '#F2AE30',
    accent: '#E57373',
    text: '#333333',
    background: '#FFFFFF'
  },
  fonts: {
    title: 'Playfair Display, serif',
    body: 'Inter, sans-serif'
  },
  logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
  showQrCode: true,
  showTestimonials: true,
  showDifferentials: true,
  showAboutSection: true
};

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ 
  proposal, 
  template = defaultTemplate, 
  onBack,
  onPdfGenerated
}) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Sanitize proposal data for safe PDF generation
  const safeProposal = ProposalHelper.ensureValidProposal(proposal);
  
  // Validate proposal data
  if (!ProposalHelper.isValidForPDF(safeProposal)) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <PDFHeader 
          proposal={safeProposal} 
          template={template}
          onBack={onBack}
          pdfBlob={null}
        />
        <div className="text-center py-8">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dados Incompletos</h3>
          <p className="text-gray-600 mb-4">
            Para gerar o PDF, é necessário preencher pelo menos:
          </p>
          <ul className="text-left text-gray-600 mb-6 max-w-sm mx-auto">
            <li>• Nome do cliente</li>
            <li>• Tipo de evento</li>
            <li>• Pelo menos um serviço</li>
            <li>• Valor total</li>
          </ul>
        </div>
      </div>
    );
  }
  
  console.log('ProposalPreview - template_id:', safeProposal.template_id);
  const isHtmlTemplate = !!safeProposal.template_id && safeProposal.template_id !== 'default';
  console.log('Is HTML template:', isHtmlTemplate);

  // Handle errors in the PDF generation process
  const handleError = (error: string) => {
    console.error('PDF generation error:', error);
    setPdfError(error);
    toast.error(`Erro ao gerar PDF: ${error}`);
  };

  // Handle PDF blob ready
  const handlePdfReady = async (blob: Blob) => {
    try {
      setPdfBlob(blob);
      
      if (!safeProposal.id) {
        throw new Error('Proposta não possui ID válido');
      }

      // Generate a unique filename for the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const clientName = safeProposal.client_name.replace(/\s+/g, '_').toLowerCase();
      const uniqueId = uuidv4();
      const filename = `proposal_${clientName}_${uniqueId}.pdf`;
      
      console.log("Uploading PDF with filename:", filename);
      
      // Upload the PDF to the proposals bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('proposals')
        .upload(filename, blob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL of the PDF
      const { data } = supabase.storage
        .from('proposals')
        .getPublicUrl(filename);
        
      const pdfUrl = data.publicUrl;
      setPdfUrl(pdfUrl);
      
      // Update the proposal with the PDF URL
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ pdf_url: pdfUrl })
        .eq('id', safeProposal.id);
      
      if (updateError) {
        console.error('Error updating proposal with PDF URL:', updateError);
        throw updateError;
      }
      
      console.log("PDF generated and saved successfully:", pdfUrl);
      
      if (onPdfGenerated) {
        await onPdfGenerated(pdfUrl);
      }
      
      toast.success("PDF gerado com sucesso!");
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast.error(`Erro ao salvar PDF: ${error.message || 'Erro desconhecido'}`);
      handleError(error.message || 'Erro ao gerar ou salvar PDF');
    }
  };
  
  // Automatically generate PDF if we have an HTML template
  useEffect(() => {
    if (isHtmlTemplate && !pdfBlob && !isLoading && !pdfError) {
      console.log('Setting isLoading to true to generate PDF');
      setIsLoading(true);
    }
  }, [isHtmlTemplate, pdfBlob, isLoading, pdfError]);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <PDFHeader 
        proposal={safeProposal} 
        template={template}
        onBack={onBack}
        pdfBlob={pdfBlob}
      />
      
      {isHtmlTemplate ? (
        <div className="p-4">
          <HtmlProposalRenderer
            proposal={safeProposal}
            templateId={safeProposal.template_id}
            onPdfReady={handlePdfReady}
            onError={handleError}
            previewOnly={activeTab === 'preview'}
          />
        </div>
      ) : (
        <PDFTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          proposal={safeProposal}
          template={template}
          isLoading={isLoading}
          pdfError={pdfError}
          onBack={onBack}
          onError={handleError}
          onPdfReady={handlePdfReady}
        />
      )}
    </div>
  );
};

export default ProposalPreview;
