
import React, { useState, useEffect } from 'react';
import { PDFPreviewContent, PDFHeader, PDFTabs, proposalUtils } from './preview';
import { ProposalData } from '../hooks/proposal';
import { ProposalTemplateData } from './templates/shared/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import PDFContentRenderer from './preview/PDFContentRenderer';
import { ProposalHelper } from '../pdf/utils/ProposalHelper';

interface ProposalPreviewProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onBack: () => void;
  onPdfGenerated?: (pdfUrl: string) => Promise<void>;
}

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
  
  const safeProposal = ProposalHelper.ensureValidProposal(proposal);
  
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

  const handleError = (error: string) => {
    console.error('PDF generation error:', error);
    setPdfError(error);
    setIsLoading(false);
    toast.error(`Erro ao gerar PDF: ${error}`);
  };

  const handlePdfReady = async (blob: Blob) => {
    try {
      setPdfBlob(blob);
      setIsLoading(false);
      
      if (!safeProposal.id) {
        throw new Error('Proposta não possui ID válido');
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const clientName = safeProposal.client_name.replace(/\s+/g, '_').toLowerCase();
      const uniqueId = uuidv4();
      const filename = `proposal_${clientName}_${uniqueId}.pdf`;
      
      console.log("Uploading PDF with filename:", filename);
      
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
      
      const { data } = supabase.storage
        .from('proposals')
        .getPublicUrl(filename);
        
      const pdfUrl = data.publicUrl;
      setPdfUrl(pdfUrl);
      
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
  
  useEffect(() => {
    if (!pdfBlob && !isLoading && !pdfError) {
      console.log('Starting PDF generation...');
      setIsLoading(true);
    }
  }, [pdfBlob, isLoading, pdfError]);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <PDFHeader 
        proposal={safeProposal} 
        template={template}
        onBack={onBack}
        pdfBlob={pdfBlob}
      />
      
      <div className="p-4">
        {/* Tabs para diferentes visualizações */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          {pdfBlob && (
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'pdf'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              PDF Gerado
            </button>
          )}
        </div>

        {/* Conteúdo baseado na tab ativa */}
        {activeTab === 'preview' && (
          <PDFContentRenderer
            proposal={safeProposal}
            template={template}
            onPdfReady={handlePdfReady}
            onError={handleError}
            previewOnly={true}
          />
        )}

        {activeTab === 'pdf' && pdfBlob && (
          <div className="text-center py-8">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Gerado com Sucesso!</h3>
            <p className="text-gray-600 mb-4">
              O PDF foi gerado e salvo automaticamente.
            </p>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Visualizar PDF
              </a>
            )}
          </div>
        )}

        {/* Estado de carregamento */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Gerando PDF...</p>
          </div>
        )}

        {/* Estado de erro */}
        {pdfError && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro na Geração do PDF</h3>
            <p className="text-gray-600 mb-4">{pdfError}</p>
            <button
              onClick={() => {
                setPdfError(null);
                setIsLoading(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Geração automática de PDF em background */}
        {!pdfBlob && !isLoading && !pdfError && (
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '793px' }}>
            <PDFContentRenderer
              proposal={safeProposal}
              template={template}
              onPdfReady={handlePdfReady}
              onError={handleError}
              previewOnly={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPreview;
