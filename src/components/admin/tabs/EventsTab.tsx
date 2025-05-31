
import React, { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EventsTab = () => {
  const { events, participants, isLoading, getParticipantsByEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

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
        <Button>
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
                Os eventos são criados automaticamente quando uma proposta é aceita
              </p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const eventParticipants = getEventParticipants(event.id);
            
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {event.type}
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                    >
                      {selectedEvent === event.id ? 'Ocultar' : 'Ver Detalhes'}
                    </Button>
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
                          <p className="text-gray-700">{event.notes}</p>
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
    </div>
  );
};

export default EventsTab;
