
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunilItem } from '@/hooks/useGestaoComercial';
import KanbanCard from './KanbanCard';

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
  return (
    <Card className={`min-w-[300px] ${column.color} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm font-semibold ${column.titleColor} flex items-center justify-between`}>
          {column.title}
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
            {column.items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 min-h-[400px]">
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
