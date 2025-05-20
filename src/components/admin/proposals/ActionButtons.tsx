
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import ProposalPDF from '@/components/admin/ProposalPDF';
import { ProposalData } from '../hooks/useProposalForm';

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
  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline" 
        onClick={onSave} 
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Salvar
      </Button>
      
      <Button 
        onClick={onGeneratePDF} 
        disabled={generatingPDF || !selectedQuote}
      >
        {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Gerar PDF
      </Button>
      
      {proposal && (
        <PDFDownloadLink 
          document={<ProposalPDF proposal={proposal} />} 
          fileName={`proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {({ loading }) => (
            loading ? 
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparando PDF...
            </span> : 
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-2" /> Baixar PDF
            </span>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default ActionButtons;
