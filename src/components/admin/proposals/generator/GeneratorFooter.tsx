
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Mail, FileText } from 'lucide-react';

interface GeneratorFooterProps {
  onClose?: () => void;
  onSendEmail: () => Promise<void>;
  onGeneratePDF: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
  isSending: boolean;
  generatingPDF: boolean;
  hasPdfUrl: boolean;
  hasSelectedQuote: boolean;
}

const GeneratorFooter: React.FC<GeneratorFooterProps> = ({
  onClose,
  onSendEmail,
  onGeneratePDF,
  isSaving,
  isDeleting,
  isSending,
  generatingPDF,
  hasPdfUrl,
  hasSelectedQuote
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-end mt-6 border-t pt-6">
      {onClose && (
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={isSaving || generatingPDF || isDeleting || isSending}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      )}
      
      <Button 
        onClick={onSendEmail}
        disabled={isSending || !hasPdfUrl}
        variant="outline"
      >
        {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
        Enviar por Email
      </Button>
      
      <Button 
        onClick={onGeneratePDF} 
        disabled={generatingPDF || !hasSelectedQuote}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Visualizar Proposta
      </Button>
    </div>
  );
};

export default GeneratorFooter;
