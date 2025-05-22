
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Save, Trash2 } from 'lucide-react';
import { ProposalData } from '@/components/admin/hooks/proposal';

interface ActionButtonsProps {
  isSaving: boolean;
  generatingPDF: boolean;
  selectedQuote: string;
  onSave: () => Promise<string | null>;
  onGeneratePDF: () => Promise<void>;
  onDelete?: () => void;
  proposal: ProposalData | null;
  isEditMode?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaving,
  generatingPDF,
  selectedQuote,
  onSave,
  onGeneratePDF,
  onDelete,
  proposal,
  isEditMode = false
}) => {
  // Calculate button disabled state
  const saveDisabled = isSaving || (!selectedQuote && !isEditMode);
  const previewDisabled = generatingPDF || (!selectedQuote && !isEditMode);

  return (
    <>
      <Button 
        variant="outline" 
        onClick={onSave} 
        disabled={saveDisabled}
        className="flex items-center"
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        {isEditMode ? 'Atualizar Proposta' : 'Salvar Proposta'}
      </Button>
      
      <Button 
        onClick={onGeneratePDF} 
        disabled={previewDisabled}
        className="bg-purple-200 hover:bg-purple-300 text-primary-foreground flex items-center"
      >
        {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
        Visualizar Proposta
      </Button>

      {isEditMode && onDelete && (
        <Button 
          variant="destructive" 
          onClick={onDelete} 
          className="flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Proposta
        </Button>
      )}
    </>
  );
};

export default ActionButtons;
