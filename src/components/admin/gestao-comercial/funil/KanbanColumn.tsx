
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

  const getColumnClasses = () => {
    if (isMobile) {
      return 'w-full';
    }
    return 'w-full h-full';
  };

  const getContentClasses = () => {
    if (isMobile) {
      return 'space-y-3 max-h-[60vh] overflow-y-auto';
    }
    if (isTablet) {
      return 'space-y-3 max-h-[500px] overflow-y-auto';
    }
    return 'space-y-3 max-h-[600px] overflow-y-auto';
  };

  const getHeaderClasses = () => {
    if (isMobile) {
      return 'pb-2';
    }
    return 'pb-3';
  };

  return (
    <Card className={`${getColumnClasses()} ${column.color} border-2`}>
      <CardHeader className={getHeaderClasses()}>
        <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold ${column.titleColor} flex items-center justify-between`}>
          <span className="truncate flex-1">{column.title}</span>
          <span className={`bg-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${isMobile ? 'min-w-[24px]' : ''}`}>
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
            <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
              Nenhum item nesta etapa
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
