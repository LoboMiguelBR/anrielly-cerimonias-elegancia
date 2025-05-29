
import React, { useState } from 'react';
import { FunilItem } from '@/hooks/useGestaoComercial';
import KanbanColumn from './KanbanColumn';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const { isMobile, isTablet } = useMobileLayout();
  const [activeColumn, setActiveColumn] = useState(0);

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

  // Layout Mobile: Tabs com navegação
  if (isMobile) {
    return (
      <div className="space-y-4">
        <Tabs value={columns[activeColumn].id} onValueChange={(value) => {
          const index = columns.findIndex(col => col.id === value);
          setActiveColumn(index);
        }}>
          {/* Navigation buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveColumn(Math.max(0, activeColumn - 1))}
              disabled={activeColumn === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                {activeColumn + 1} de {columns.length}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveColumn(Math.min(columns.length - 1, activeColumn + 1))}
              disabled={activeColumn === columns.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab triggers - scrollable */}
          <TabsList className="w-full grid grid-cols-2 gap-1 mb-4 h-auto">
            {columns.slice(activeColumn, activeColumn + 2).map((column) => (
              <TabsTrigger 
                key={column.id} 
                value={column.id}
                className="text-xs p-2 h-auto whitespace-normal text-center"
              >
                {column.title}
                <span className="block text-xs opacity-70">
                  ({column.items.length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab content */}
          {columns.map((column) => (
            <TabsContent key={column.id} value={column.id} className="mt-0">
              <KanbanColumn
                column={column}
                onUpdateStatus={onUpdateStatus}
                onCreateProposal={onCreateProposal}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  // Layout Tablet: 2-3 colunas
  if (isTablet) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
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
  }

  // Layout Desktop: Todas as 7 colunas
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
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
