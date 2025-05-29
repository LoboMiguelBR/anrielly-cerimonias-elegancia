
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunilItem } from '@/hooks/useGestaoComercial';
import KanbanCard from './KanbanCard';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface Column {
  id: string;
  title: string;
  color: string;
  titleColor: string;
  items: FunilItem[];
}

interface KanbanColumnProps {
  column: Column;
  onUpdateStatus: (itemId: string, newStatus: string, itemType: 'quote' | 'proposal' | 'contract') => Promise<void>;
  onCreateProposal: (quoteId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onUpdateStatus,
  onCreateProposal
}) => {
  const { isMobile, isTablet } = useMobileLayout();

  // Responsividade melhorada para diferentes telas
  const getColumnClasses = () => {
    if (isMobile) {
      return 'w-full max-w-full';
    }
    if (isTablet) {
      return 'min-w-[260px] max-w-[300px]';
    }
    return 'min-w-[280px] max-w-[320px] flex-shrink-0';
  };

  const getContentClasses = () => {
    if (isMobile) {
      return 'space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto';
    }
    return 'space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto';
  };

  return (
    <Card className={`${getColumnClasses()} ${column.color} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${isMobile ? 'text-base' : 'text-sm'} font-semibold ${column.titleColor} flex items-center justify-between`}>
          <span className="truncate flex-1">{column.title}</span>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2">
            {column.items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={getContentClasses()}>
        {column.items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            onUpdateStatus={onUpdateStatus}
            onCreateProposal={onCreateProposal}
          />
        ))}
        {column.items.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Nenhum item nesta etapa</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
