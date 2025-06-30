
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FunilItem } from '@/hooks/useGestaoComercial';
import { ArrowRight, User, FileText, File, Calendar } from 'lucide-react';

interface LeadTrackerProps {
  item: FunilItem;
}

const LeadTracker: React.FC<LeadTrackerProps> = ({ item }) => {
  const getStageIcon = (type: string) => {
    switch (type) {
      case 'quote': return <User className="h-4 w-4" />;
      case 'proposal': return <FileText className="h-4 w-4" />;
      case 'contract': return <File className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStageLabel = (type: string) => {
    switch (type) {
      case 'quote': return 'Lead';
      case 'proposal': return 'Proposta';
      case 'contract': return 'Contrato';
      default: return 'Lead';
    }
  };

  const getNextStage = (currentType: string) => {
    switch (currentType) {
      case 'quote': return 'Proposta';
      case 'proposal': return 'Contrato';
      case 'contract': return 'Evento';
      default: return null;
    }
  };

  return (
    <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Jornada do Lead: {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            {getStageIcon(item.type)}
            <span className="font-medium">{getStageLabel(item.type)}</span>
            <Badge variant="outline" className="text-xs">
              {item.status}
            </Badge>
          </div>
          
          {getNextStage(item.type) && (
            <>
              <ArrowRight className="h-3 w-3 text-gray-400" />
              <span className="text-gray-500">Próximo: {getNextStage(item.type)}</span>
            </>
          )}
        </div>
        
        {item.leadId && (
          <div className="mt-2 text-xs text-gray-500">
            Lead ID: {item.leadId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadTracker;
