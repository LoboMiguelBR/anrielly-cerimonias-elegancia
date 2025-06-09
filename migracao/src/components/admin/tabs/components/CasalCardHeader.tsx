
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users } from 'lucide-react';

interface CasalCardHeaderProps {
  linkPublico: string;
  status: string | null;
  temPersonalizacao: boolean;
  totalQuestionarios: number;
}

const CasalCardHeader = ({ 
  linkPublico, 
  status, 
  temPersonalizacao, 
  totalQuestionarios 
}: CasalCardHeaderProps) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'preenchido': return 'bg-green-100 text-green-800';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Heart className="w-5 h-5 text-rose-500" />
        <div>
          <CardTitle className="text-lg">
            Casal: {linkPublico.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status || 'N/A'}
            </Badge>
            {temPersonalizacao && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                🎨 Personalizado
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{totalQuestionarios} questionário(s)</span>
      </div>
    </div>
  );
};

export default CasalCardHeader;
