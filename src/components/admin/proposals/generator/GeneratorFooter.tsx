
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Mail, Save, ArrowLeft, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionButtons from '../ActionButtons';

interface GeneratorFooterProps {
  onClose?: () => void;
  onSendEmail: () => Promise<void>;
  onGeneratePDF: () => Promise<void>;
  onDelete?: () => Promise<void>;
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
  onDelete,
  isSaving,
  isDeleting,
  isSending,
  generatingPDF,
  hasPdfUrl,
  hasSelectedQuote
}) => {
  // Save button disabled state
  const saveDisabled = isSaving || !hasSelectedQuote;
  
  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t">
      {onClose && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="mr-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
      
      <ActionButtons
        isSaving={isSaving}
        generatingPDF={generatingPDF}
        selectedQuote={hasSelectedQuote ? "selected" : ""}
        onSave={async () => {
          await onGeneratePDF();
          return null;
        }}
        onGeneratePDF={onGeneratePDF}
        onDelete={onDelete}
        proposal={null}
        isEditMode={!!onDelete}
      />
      
      {hasPdfUrl && (
        <Button
          onClick={onSendEmail}
          disabled={isSending}
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white",
            "flex items-center"
          )}
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Enviar por Email
        </Button>
      )}
    </div>
  );
};

export default GeneratorFooter;
