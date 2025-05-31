
import React from 'react';
import { Sparkles } from 'lucide-react';
import { QuestionarioCasal } from '../types/questionario';

interface CasalCardContentProps {
  casalGroup: QuestionarioCasal[];
  historiaGerada: string | null;
}

const CasalCardContent = ({ casalGroup, historiaGerada }: CasalCardContentProps) => {
  const formatarData = (data: string | null) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {casalGroup.map((casal) => (
          <div key={casal.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{casal.nome_responsavel}</div>
            <div className="text-sm text-gray-600">{casal.email}</div>
            <div className="text-xs text-gray-500 mt-1">
              {casal.total_perguntas_resp || 0} respostas • Atualizado em {formatarData(casal.data_atualizacao)}
            </div>
          </div>
        ))}
      </div>

      {historiaGerada && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">História Gerada</span>
          </div>
          <p className="text-sm text-green-700 line-clamp-3">
            {historiaGerada.substring(0, 200)}...
          </p>
        </div>
      )}
    </div>
  );
};

export default CasalCardContent;
