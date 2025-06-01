
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useEventActions } from '@/hooks/useEventActions';
import { Event } from '@/hooks/useEvents';
import ManageParticipantsModal from './ManageParticipantsModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventsTableProps {
  events: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

const EventsTable = ({ events, isLoading, onRefresh }: EventsTableProps) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);
  const [managingParticipants, setManagingParticipants] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteEvent, loading: actionLoading } = useEventActions();

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'em_planejamento':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Em Planejamento</Badge>;
      case 'confirmado':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Confirmado</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Em Andamento</Badge>;
      case 'concluido':
        return <Badge variant="outline" className="text-green-600 border-green-200">Concluído</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="text-red-600 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">{status}</Badge>;
    }
  };

  const filteredEvents = events.filter(event =>
    searchTerm === '' ||
    event.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingEvent) return;
    
    const success = await deleteEvent(deletingEvent.id);
    if (success) {
      onRefresh();
      setDeletingEvent(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por tipo, local ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum evento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.type}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                      {event.client && (
                        <div>
                          <strong>Cliente:</strong> {event.client.name}
                        </div>
                      )}
                      {event.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Descrição:</strong> {event.description}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.participants?.length || 0} participantes
                      </div>
                      <div>
                        Criado em {format(new Date(event.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setManagingParticipants(event)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Participantes
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingEvent(event)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-gray-900">{selectedEvent.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                </div>
                {selectedEvent.client && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cliente</label>
                      <p className="text-gray-900">{selectedEvent.client.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email do Cliente</label>
                      <p className="text-gray-900">{selectedEvent.client.email}</p>
                    </div>
                  </>
                )}
                {selectedEvent.date && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data</label>
                    <p className="text-gray-900">
                      {format(new Date(selectedEvent.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                )}
                {selectedEvent.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Local</label>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                )}
              </div>
              
              {selectedEvent.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Descrição</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedEvent.notes}
                  </p>
                </div>
              )}

              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Participantes</label>
                  <div className="mt-1 space-y-2">
                    {selectedEvent.participants.map((participant: any) => (
                      <div key={participant.id} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {participant.client?.name || participant.professional?.name || participant.user_email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {participant.participant_type} - {participant.role}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {participant.invited && (
                            <Badge variant="outline" size="sm">Convidado</Badge>
                          )}
                          {participant.accepted && (
                            <Badge variant="outline" className="bg-green-50 text-green-700" size="sm">Aceito</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Gerenciar Participantes */}
      <ManageParticipantsModal
        open={!!managingParticipants}
        onOpenChange={() => setManagingParticipants(null)}
        onSuccess={onRefresh}
        event={managingParticipants}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o evento "{deletingEvent?.type}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventsTable;
