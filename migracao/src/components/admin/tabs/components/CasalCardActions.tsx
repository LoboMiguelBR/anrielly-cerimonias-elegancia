
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';

interface CasalCardActionsProps {
  linkPublico: string;
  temHistoria: boolean;
  isGenerating: boolean;
  casalGroupLength: number;
  onPersonalizacao: (linkPublico: string) => void;
  onGerarHistoria: (linkPublico: string) => void;
  onVerHistoria: (linkPublico: string) => void;
}

const CasalCardActions = ({
  linkPublico,
  temHistoria,
  isGenerating,
  casalGroupLength,
  onPersonalizacao,
  onGerarHistoria,
  onVerHistoria
}: CasalCardActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPersonalizacao(linkPublico)}
      >
        🎨 Personalizar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onGerarHistoria(linkPublico)}
        disabled={isGenerating || casalGroupLength < 2}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
            Gerando...
          </>
        ) : (
          <>
            <RefreshCw className="w-3 h-3 mr-2" />
            {temHistoria ? 'Regenerar' : 'Gerar'} História
          </>
        )}
      </Button>

      {temHistoria && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVerHistoria(linkPublico)}
        >
          <Eye className="w-3 h-3 mr-2" />
          Ver História
        </Button>
      )}
    </div>
  );
};

export default CasalCardActions;
