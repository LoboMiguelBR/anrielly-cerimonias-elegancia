
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FunilItem } from '@/hooks/useGestaoComercial';
import { FileText, Users, Calendar, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KanbanCardProps {
  item: FunilItem;
  onUpdateStatus: (itemId: string, newStatus: string, itemType: 'quote' | 'proposal' | 'contract') => Promise<void>;
  onCreateProposal: (quoteId: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  item,
  onUpdateStatus,
  onCreateProposal
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data não informada';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quote': return 'Lead';
      case 'proposal': return 'Proposta';
      case 'contract': return 'Contrato';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quote': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = () => {
    if (item.type === 'quote') {
      return [
        { value: 'aguardando', label: 'Aguardando' },
        { value: 'contatado', label: 'Contatado' },
        { value: 'perdido', label: 'Perdido' }
      ];
    }
    if (item.type === 'proposal') {
      return [
        { value: 'draft', label: 'Rascunho' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'negociacao', label: 'Em Negociação' },
        { value: 'aprovado', label: 'Aprovado' },
        { value: 'perdido', label: 'Perdido' }
      ];
    }
    if (item.type === 'contract') {
      return [
        { value: 'draft', label: 'Rascunho' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'em_andamento', label: 'Em Andamento' },
        { value: 'assinado', label: 'Assinado' },
        { value: 'perdido', label: 'Perdido' }
      ];
    }
    return [];
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(item.id, newStatus, item.type);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const canCreateProposal = item.type === 'quote' && !['perdido'].includes(item.status);

  const handleCreateProposal = () => {
    // Usar o originalId (ID real) para criar a proposta
    onCreateProposal(item.originalId);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 space-y-3">
        {/* Header com nome e tipo */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-1">{item.event_type}</p>
          </div>
          <Badge className={`text-xs ${getTypeColor(item.type)}`}>
            {getTypeLabel(item.type)}
          </Badge>
        </div>

        {/* Informações de contato */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="h-3 w-3" />
            <span className="line-clamp-1">{item.email}</span>
          </div>
          {item.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{item.phone}</span>
            </div>
          )}
        </div>

        {/* Informações do evento */}
        {item.event_date && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.event_date)}</span>
          </div>
        )}
        
        {item.event_location && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{item.event_location}</span>
          </div>
        )}

        {/* Valor se disponível */}
        {item.total_price && (
          <div className="text-sm font-semibold text-green-600">
            {formatCurrency(item.total_price)}
          </div>
        )}

        {/* Data de criação */}
        <div className="text-xs text-gray-400">
          Criado em {formatDate(item.created_at)}
        </div>

        {/* Atualizar Status */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Status:</label>
          <Select 
            value={item.status} 
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          {canCreateProposal && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateProposal}
              className="flex-1 text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Gerar Proposta
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
