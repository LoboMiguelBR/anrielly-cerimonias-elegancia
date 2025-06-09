
import React, { useState, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollToColumn = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  // Layout Mobile: Uma coluna por vez com navegação por tabs
  if (isMobile) {
    return (
      <div className="space-y-4 w-full">
        <Tabs value={columns[activeColumn].id} onValueChange={(value) => {
          const index = columns.findIndex(col => col.id === value);
          setActiveColumn(index);
        }}>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveColumn(Math.max(0, activeColumn - 1))}
              disabled={activeColumn === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <TabsList className="grid grid-cols-1 h-auto">
              <TabsTrigger 
                value={columns[activeColumn].id}
                className="text-sm px-2 py-1 whitespace-nowrap"
              >
                {columns[activeColumn].title} ({columns[activeColumn].items.length})
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveColumn(Math.min(columns.length - 1, activeColumn + 1))}
              disabled={activeColumn === columns.length - 1}
              className="flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value={columns[activeColumn].id} className="mt-0">
            <KanbanColumn
              column={columns[activeColumn]}
              onUpdateStatus={onUpdateStatus}
              onCreateProposal={onCreateProposal}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Layout Tablet: 2 colunas com scroll horizontal
  if (isTablet) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Funil de Vendas</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToColumn('left')}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToColumn('right')}
              className="flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300"
        >
          <div className="flex gap-4 min-w-fit">
            {columns.map((column) => (
              <div key={column.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
                <KanbanColumn
                  column={column}
                  onUpdateStatus={onUpdateStatus}
                  onCreateProposal={onCreateProposal}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout Desktop: Scroll horizontal controlado com indicadores
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Funil de Vendas</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToColumn('left')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToColumn('right')}
            className="flex items-center gap-1"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300"
        style={{ maxWidth: '100%' }}
      >
        <div className="flex gap-4 min-w-fit">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[240px] max-w-[280px] flex-shrink-0">
              <KanbanColumn
                column={column}
                onUpdateStatus={onUpdateStatus}
                onCreateProposal={onCreateProposal}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="flex justify-center mt-2">
        <div className="text-xs text-gray-500">
          Use as setas ou arraste horizontalmente para navegar
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
