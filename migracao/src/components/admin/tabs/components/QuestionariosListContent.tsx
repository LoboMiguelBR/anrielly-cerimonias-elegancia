
import React from 'react';
import CasalCard from './CasalCard';
import HistoriasCasaisEmptyState from './HistoriasCasaisEmptyState';
import { QuestionarioCasal } from '../types/questionario';

interface QuestionariosListContentProps {
  groupedCasais: Record<string, QuestionarioCasal[]>;
  isGenerating: string | null;
  onPersonalizacao: (linkPublico: string) => void;
  onGerarHistoria: (linkPublico: string) => void;
  onVerHistoria: (linkPublico: string) => void;
}

const QuestionariosListContent = ({
  groupedCasais,
  isGenerating,
  onPersonalizacao,
  onGerarHistoria,
  onVerHistoria
}: QuestionariosListContentProps) => {
  if (Object.keys(groupedCasais).length === 0) {
    return <HistoriasCasaisEmptyState />;
  }

  return (
    <div className="grid gap-6">
      {Object.entries(groupedCasais).map(([linkPublico, casalGroup]) => (
        <CasalCard
          key={linkPublico}
          linkPublico={linkPublico}
          casalGroup={casalGroup}
          isGenerating={isGenerating}
          onPersonalizacao={onPersonalizacao}
          onGerarHistoria={onGerarHistoria}
          onVerHistoria={onVerHistoria}
        />
      ))}
    </div>
  );
};

export default QuestionariosListContent;
