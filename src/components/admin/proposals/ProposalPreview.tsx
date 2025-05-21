
import React, { useState, useEffect } from 'react';
import { ProposalData } from '../hooks/proposal';
import { ProposalTemplateData } from './templates/shared/types';
import { PDFHeader, PDFTabs, EmptyPreview } from './preview';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ProposalPreviewProps {
  proposal: ProposalData | null;
  template: ProposalTemplateData;
  onBack: () => void;
  onPdfGenerated?: (pdfUrl: string) => void;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ 
  proposal, 
  template, 
  onBack,
  onPdfGenerated
}) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderKey, setRenderKey] = useState<number>(0); // Usado para forçar re-render do PDF
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  console.log("Rendering ProposalPreview with proposal:", proposal);
  
  useEffect(() => {
    // Reset error state when proposal changes
    setPdfError(null);
    setIsLoading(true);
    
    // Forçar re-render do componente para garantir que o PDF seja carregado
    setRenderKey(prev => prev + 1);
    
    // Simulate loading complete após um tempo
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("PDF loading timeout complete");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [proposal]);
  
  if (!proposal) {
    console.log("No proposal data available");
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <PDFHeader
          proposal={{
            id: '',
            client_name: 'Cliente',
            client_email: '',
            client_phone: '',
            event_type: 'Evento',
            event_date: null,
            event_location: 'A definir',
            services: [],
            total_price: 0,
            payment_terms: '',
            notes: null,
            validity_date: new Date().toISOString(),
            quote_request_id: null
          }} 
          template={template}
          onBack={onBack}
        />
        <EmptyPreview template={template} onBack={onBack} />
      </div>
    );
  }

  const handlePdfError = (errorMessage: string) => {
    console.error('Erro ao gerar PDF:', errorMessage);
    setPdfError(errorMessage);
    setIsLoading(false);
  };

  const handlePdfReady = async (blob: Blob) => {
    setPdfBlob(blob);
    
    if (onPdfGenerated) {
      try {
        setIsLoading(true);
        
        // Generate a unique file name
        const fileName = `proposal_${proposal.id}_${uuidv4()}.pdf`;
        const filePath = `proposals/${fileName}`;
        
        // Upload the PDF to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('proposals')
          .upload(filePath, blob, {
            contentType: 'application/pdf',
            upsert: true
          });
          
        if (uploadError) {
          console.error("Error uploading PDF:", uploadError);
          toast.error("Erro ao fazer upload do PDF");
          return;
        }
        
        // Get the public URL
        const { data: urlData } = await supabase
          .storage
          .from('proposals')
          .getPublicUrl(filePath);
          
        if (urlData && urlData.publicUrl) {
          // Pass the URL back to the parent component
          onPdfGenerated(urlData.publicUrl);
          toast.success("PDF gerado e salvo com sucesso");
        }
      } catch (error) {
        console.error("Error handling PDF ready:", error);
        toast.error("Erro ao processar o PDF");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white border rounded-lg" key={renderKey}>
      <PDFHeader 
        proposal={proposal} 
        template={template}
        pdfBlob={pdfBlob}
        onBack={onBack} 
      />

      <PDFTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        proposal={proposal}
        template={template}
        isLoading={isLoading}
        pdfError={pdfError}
        onBack={onBack}
        onError={handlePdfError}
        onPdfReady={handlePdfReady}
      />
    </div>
  );
};

export default ProposalPreview;
