
import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProposalPDF from '@/components/admin/ProposalPDF';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import { supabase } from '@/integrations/supabase/client';

interface PDFActionsProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onBack: () => void;
  pdfBlob?: Blob | null;
}

const PDFActions: React.FC<PDFActionsProps> = ({ 
  proposal, 
  template,
  onBack,
  pdfBlob
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleEmailProposal = async () => {
    if (!proposal.client_email) {
      toast.error("Email do cliente não definido");
      return;
    }
    
    if (!proposal.pdf_url) {
      toast.error("É necessário gerar o PDF antes de enviar por email");
      return;
    }
    
    try {
      setIsSending(true);
      
      const { error } = await supabase.functions.invoke('send-proposal', {
        body: {
          proposalId: proposal.id,
          to: proposal.client_email,
          clientName: proposal.client_name,
          pdfUrl: proposal.pdf_url
        }
      });
      
      if (error) throw new Error(error.message);
      
      toast.success(`Proposta enviada para ${proposal.client_email}`);
    } catch (error: any) {
      console.error('Erro ao enviar proposta:', error);
      toast.error(`Erro ao enviar proposta: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Criar o nome do arquivo baseado no nome do cliente
  const getPdfFilename = () => {
    const clientName = proposal.client_name || "cliente";
    const cleanName = clientName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    return `proposta_${cleanName}_${timestamp}.pdf`;
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    
    try {
      setIsDownloading(true);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getPdfFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Download iniciado");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error("Erro ao baixar PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>
      
      {pdfBlob ? (
        <Button 
          variant="default" 
          size="sm" 
          className="bg-gold/80 text-white hover:bg-gold"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Baixar PDF
        </Button>
      ) : (
        <PDFDownloadLink
          document={<ProposalPDF proposal={proposal} template={template} />}
          fileName={getPdfFilename()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold h-9 px-3 py-2"
        >
          {({ loading, error }) => {
            if (loading) return (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparando PDF...
              </span>
            );
            
            if (error) {
              console.error("Erro ao preparar PDF:", error);
              return (
                <span className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Tentar de novo
                </span>
              );
            }
            
            return (
              <span className="flex items-center">
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </span>
            );
          }}
        </PDFDownloadLink>
      )}
      
      <Button 
        variant="outline"
        className="border-gold/50 text-gold/80 hover:bg-gold/10"
        onClick={handleEmailProposal}
        disabled={isSending || !proposal.pdf_url}
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Mail className="w-4 h-4 mr-2" />
        )}
        {isSending ? 'Enviando...' : 'Enviar'}
      </Button>
    </div>
  );
};

export default PDFActions;
