
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ProposalPDF from '@/components/admin/ProposalPDF';
import { ProposalData } from '@/components/admin/pdf/types';

interface PreviewActionsProps {
  proposal: ProposalData;
  onBack: () => void;
}

const PreviewActions: React.FC<PreviewActionsProps> = ({ proposal, onBack }) => {
  const handleEmailProposal = () => {
    // This is a placeholder for future email functionality
    toast.info("Funcionalidade de envio por email será implementada em breve");
  };

  // Criar o nome do arquivo baseado no nome do cliente
  const getPdfFilename = () => {
    const clientName = proposal.client_name || "cliente";
    const cleanName = clientName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    return `proposta_${cleanName}_${timestamp}.pdf`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>
      
      <PDFDownloadLink
        document={<ProposalPDF proposal={proposal} />}
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
      
      <Button 
        variant="outline"
        className="border-gold/50 text-gold/80 hover:bg-gold/10"
        onClick={handleEmailProposal}
      >
        <Mail className="w-4 h-4 mr-2" /> Enviar
      </Button>
    </div>
  );
};

export default PreviewActions;
