
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Save, Mail } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from '@/components/admin/ProposalPDF';
import { ProposalData } from '../hooks/useProposalForm';
import { toast } from 'sonner';

interface ActionButtonsProps {
  isSaving: boolean;
  generatingPDF: boolean;
  selectedQuote: string;
  onSave: () => Promise<string | null>;
  onGeneratePDF: () => Promise<void>;
  proposal: ProposalData | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaving,
  generatingPDF,
  selectedQuote,
  onSave,
  onGeneratePDF,
  proposal
}) => {
  const handleEmailProposal = () => {
    // This is a placeholder for future email functionality
    toast.info("Funcionalidade de envio por email será implementada em breve");
  };
  
  return (
    <div className="flex flex-wrap gap-3 justify-end mt-6">
      <Button 
        variant="outline" 
        onClick={onSave} 
        disabled={isSaving || !selectedQuote}
        className="flex items-center"
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Salvar Proposta
      </Button>
      
      <Button 
        onClick={onGeneratePDF} 
        disabled={generatingPDF || !selectedQuote}
        className="bg-purple-200 hover:bg-purple-300 text-primary-foreground"
      >
        {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Visualizar PDF
      </Button>
      
      {proposal && (
        <>
          <PDFDownloadLink 
            document={<ProposalPDF proposal={proposal} />} 
            fileName={`proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold h-10 px-4 py-2"
          >
            {({ loading, error }) => (
              loading ? 
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparando PDF...
              </span> : 
              error ? 
              <span className="flex items-center">
                Erro ao gerar PDF
              </span> :
              <span className="flex items-center">
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </span>
            )}
          </PDFDownloadLink>
          
          <Button
            variant="outline"
            className="border-gold/50 text-gold/80 hover:bg-gold/10"
            onClick={handleEmailProposal}
          >
            <Mail className="w-4 h-4 mr-2" /> Enviar por Email
          </Button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
