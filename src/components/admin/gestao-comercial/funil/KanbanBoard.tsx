
import React from 'react';
import { FunilItem } from '@/hooks/useGestaoComercial';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  funilData: Record<string, FunilItem[]>;
  onUpdateStatus: (itemId: string, newStatus: string, itemType: 'quote' | 'proposal' | 'contract') => Promise<void>;
  onCreateProposal: (quoteId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  funilData,
  onUpdateStatus,
  onCreateProposal
}) => {
  const columns = [
    {
      id: 'lead-captado',
      title: 'Lead Captado',
      color: 'bg-gray-50 border-gray-200',
      titleColor: 'text-gray-700',
      items: funilData['lead-captado'] || []
    },
    {
      id: 'contato-realizado',
      title: 'Contato Realizado',
      color: 'bg-blue-50 border-blue-200',
      titleColor: 'text-blue-700',
      items: funilData['contato-realizado'] || []
    },
    {
      id: 'orcamento-enviado',
      title: 'Orçamento Enviado',
      color: 'bg-purple-50 border-purple-200',
      titleColor: 'text-purple-700',
      items: funilData['orcamento-enviado'] || []
    },
    {
      id: 'em-negociacao',
      title: 'Em Negociação',
      color: 'bg-orange-50 border-orange-200',
      titleColor: 'text-orange-700',
      items: funilData['em-negociacao'] || []
    },
    {
      id: 'pronto-contrato',
      title: 'Pronto para Contrato',
      color: 'bg-yellow-50 border-yellow-200',
      titleColor: 'text-yellow-700',
      items: funilData['pronto-contrato'] || []
    },
    {
      id: 'contrato-assinado',
      title: 'Contrato Assinado',
      color: 'bg-green-50 border-green-200',
      titleColor: 'text-green-700',
      items: funilData['contrato-assinado'] || []
    },
    {
      id: 'perdido',
      title: 'Perdido',
      color: 'bg-red-50 border-red-200',
      titleColor: 'text-red-700',
      items: funilData['perdido'] || []
    }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onUpdateStatus={onUpdateStatus}
          onCreateProposal={onCreateProposal}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
