
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventActions } from '@/hooks/useEventActions';
import { toast } from 'sonner';

interface ProposalItemProps {
  proposal: any;
  onView: (proposal: any) => void;
  onEdit: (proposal: any) => void;
  onDelete: (proposal: any) => void;
}

const ProposalItem: React.FC<ProposalItemProps> = ({
  proposal,
  onView,
  onEdit,
  onDelete
}) => {
  const { createEvent } = useEventActions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'sent':
        return 'Enviada';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = {
        type: proposal.event_type,
        date: proposal.event_date,
        location: proposal.event_location,
        status: 'em_planejamento' as const,
        description: `Evento criado a partir da proposta para ${proposal.client_name}`,
      };

      await createEvent(eventData);
      toast.success('Evento criado automaticamente a partir da proposta aceita');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const canCreateEvent = proposal.status === 'accepted';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {proposal.client_name}
              <Badge className={getStatusColor(proposal.status)}>
                {getStatusLabel(proposal.status)}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {proposal.event_type}
              </div>
              {proposal.event_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(proposal.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              )}
              {proposal.event_location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {proposal.event_location}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canCreateEvent && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateEvent}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Criar Evento
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onView(proposal)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(proposal)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(proposal)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Valor Total:</span>
            <span className="font-semibold">
              R$ {proposal.total_price ? parseFloat(proposal.total_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Validade:</span>
            <span>
              {proposal.validity_date ? format(new Date(proposal.validity_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definida'}
            </span>
          </div>
          {proposal.notes && (
            <div className="text-sm text-gray-600 mt-2">
              <strong>Observações:</strong> {proposal.notes.substring(0, 100)}
              {proposal.notes.length > 100 && '...'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalItem;
