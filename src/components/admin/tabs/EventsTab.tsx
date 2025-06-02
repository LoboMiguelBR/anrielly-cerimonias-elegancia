
import React, { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useEventActions } from '@/hooks/useEventActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CreateEventModal from '../events/CreateEventModal';
import EditEventModal from '../events/EditEventModal';
import EventStatusSelect from '../events/EventStatusSelect';
import ManageParticipantsModal from '../events/ManageParticipantsModal';

interface Event {
  id: string;
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type: string;
  date?: string;
  location?: string;
  status: 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';
  tenant_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const EventsTab = () => {
  const { events, participants, isLoading, getParticipantsByEvent, fetchEvents } = useEvents();
  const { deleteEvent, loading: actionLoading } = useEventActions();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [managingParticipants, setManagingParticipants] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_planejamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'contratado':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_planejamento':
        return 'Em Planejamento';
      case 'contratado':
        return 'Contratado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getEventParticipants = (eventId: string) => {
    return participants.filter(p => p.event_id === eventId);
  };

  const handleEventCreated = () => {
    fetchEvents();
    setShowCreateModal(false);
  };

  const handleEventUpdated = () => {
    fetchEvents();
    setEditingEvent(null);
  };

  const handleStatusChange = () => {
    fetchEvents();
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    
    const success = await deleteEvent(deletingEvent.id);
    if (success) {
      fetchEvents();
      setDeletingEvent(null);
    }
  };

  const handleParticipantsUpdated = () => {
    fetchEvents();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Eventos</h2>
          <p className="text-gray-600">Gerencie eventos, participantes e cronogramas</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Lista de Eventos */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-500 text-center mb-4">
                Crie eventos manualmente ou eles serão criados automaticamente quando uma proposta for aceita
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const eventParticipants = getEventParticipants(event.id);
            
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {event.type}
                        <EventStatusSelect
                          eventId={event.id}
                          currentStatus={event.status}
                          onStatusChange={handleStatusChange}
                        />
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {eventParticipants.length} participantes
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                      >
                        {selectedEvent === event.id ? 'Ocultar' : 'Ver Detalhes'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setManagingParticipants(event.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
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
                </CardHeader>

                {selectedEvent === event.id && (
                  <CardContent className="border-t">
                    <div className="space-y-4">
                      {/* Participantes */}
                      <div>
                        <h4 className="font-semibold mb-2">Participantes</h4>
                        {eventParticipants.length > 0 ? (
                          <div className="space-y-2">
                            {eventParticipants.map((participant) => (
                              <div
                                key={participant.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <span className="font-medium">{participant.name || participant.user_email}</span>
                                  <span className="text-sm text-gray-600 ml-2">({participant.role})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {participant.invited && (
                                    <Badge variant="outline" className="text-xs">
                                      Convidado
                                    </Badge>
                                  )}
                                  {participant.accepted && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                      Aceito
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">Nenhum participante adicionado</p>
                        )}
                      </div>

                      {/* Notas */}
                      {event.notes && (
                        <div>
                          <h4 className="font-semibold mb-2">Observações</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{event.notes}</p>
                        </div>
                      )}

                      {/* IDs de referência */}
                      <div className="text-xs text-gray-500 space-y-1">
                        {event.proposal_id && <div>Proposta ID: {event.proposal_id}</div>}
                        {event.quote_id && <div>Orçamento ID: {event.quote_id}</div>}
                        {event.contract_id && <div>Contrato ID: {event.contract_id}</div>}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Modal de Criação de Evento */}
      <CreateEventModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />

      {/* Modal de Edição */}
      <EditEventModal
        open={!!editingEvent}
        onOpenChange={() => setEditingEvent(null)}
        onSuccess={handleEventUpdated}
        event={editingEvent}
      />

      {/* Modal de Gerenciar Participantes */}
      <ManageParticipantsModal
        open={!!managingParticipants}
        onOpenChange={() => setManagingParticipants(null)}
        eventId={managingParticipants}
        onSuccess={handleParticipantsUpdated}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o evento "{deletingEvent?.type}"? Esta ação não pode ser desfeita e também removerá todos os participantes.
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

export default EventsTab;
