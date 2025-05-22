
import React, { useState, useEffect } from 'react';
import { PDFPreviewContent, PDFHeader, PDFTabs, proposalUtils } from './preview';
import { ProposalData, generateProposalPDF } from '../hooks/proposal';
import { ProposalTemplateData } from './templates/shared/types';
import { defaultTemplate } from './templates/shared/templateService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ProposalPreviewProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onBack: () => void;
  onPdfGenerated?: (pdfUrl: string) => Promise<void>;
}

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

  // Handle errors in the PDF generation process
  const handleError = (error: string) => {
    setPdfError(error);
  };

  // Handle PDF blob ready
  const handlePdfReady = async (blob: Blob) => {
    try {
      setPdfBlob(blob);
      
      if (!proposal.id) {
        throw new Error('Proposta não possui ID válido');
      }

      // Generate a unique filename for the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const clientName = proposal.client_name.replace(/\s+/g, '_').toLowerCase();
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
        .eq('id', proposal.id);
      
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
  
  return (
    <div className="bg-white rounded-lg shadow">
      <PDFHeader 
        proposal={proposal} 
        template={template}
        onBack={onBack}
        pdfBlob={pdfBlob}
      />
      
      <PDFTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        proposal={proposal}
        template={template}
        isLoading={isLoading}
        pdfError={pdfError}
        onBack={onBack}
        onError={handleError}
        onPdfReady={handlePdfReady}
      />
    </div>
  );
};

export default ProposalPreview;
