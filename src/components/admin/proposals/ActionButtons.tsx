
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Save } from 'lucide-react';
import { ProposalData } from '@/components/admin/pdf/types';

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
        Visualizar Proposta
      </Button>
    </div>
  );
};

export default ActionButtons;
