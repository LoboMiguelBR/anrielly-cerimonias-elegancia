
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Mail, Loader2 } from 'lucide-react';
import { ProposalData } from '../../hooks/proposal/types';
import { ProposalTemplateData } from '../templates/shared/types';
import { useProposalPDF } from '../hooks/useProposalPDF';

interface ProposalActionButtonsProps {
  proposal: ProposalData | null;
  template: ProposalTemplateData | null;
  isFormValid: boolean;
  onSave: () => Promise<boolean>;
  isSaving: boolean;
}

const ProposalActionButtons: React.FC<ProposalActionButtonsProps> = ({
  proposal,
  template,
  isFormValid,
  onSave,
  isSaving
}) => {
  const {
    isGeneratingPDF,
    isSendingEmail,
    pdfUrl,
    setPdfUrl,
    generateAndSavePDF,
    downloadPDF,
    sendProposalByEmail
  } = useProposalPDF();

  // Set PDF URL from proposal if it exists
  React.useEffect(() => {
    if (proposal?.pdf_url && !pdfUrl) {
      setPdfUrl(proposal.pdf_url);
    }
  }, [proposal?.pdf_url, pdfUrl, setPdfUrl]);

  const handleGeneratePDF = async () => {
    if (!proposal || !template) {
      // Save first if proposal doesn't exist
      const success = await onSave();
      if (!success) return;
      return;
    }
    
    await generateAndSavePDF(proposal, template);
  };

  const handleDownload = () => {
    if (pdfUrl && proposal?.id) {
      downloadPDF(pdfUrl, proposal.id);
    }
  };

  const handleSendEmail = async () => {
    if (!proposal || !pdfUrl) return;
    await sendProposalByEmail(proposal, pdfUrl);
  };

  const currentPdfUrl = pdfUrl || proposal?.pdf_url;

  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t">
      {/* Generate PDF Button */}
      <Button
        type="button"
        onClick={handleGeneratePDF}
        disabled={!isFormValid || isGeneratingPDF || isSaving}
        className="flex items-center gap-2"
      >
        {isGeneratingPDF ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar PDF'}
      </Button>

      {/* Download PDF Button */}
      {currentPdfUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      )}

      {/* Send Email Button */}
      {currentPdfUrl && proposal?.client_email && (
        <Button
          type="button"
          onClick={handleSendEmail}
          disabled={isSendingEmail}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isSendingEmail ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isSendingEmail ? 'Enviando...' : 'Enviar por Email'}
        </Button>
      )}
    </div>
  );
};

export default ProposalActionButtons;
