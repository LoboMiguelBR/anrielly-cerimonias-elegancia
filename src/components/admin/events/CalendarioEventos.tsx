
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';

interface CalendarioEventosProps {
  onEventSelect?: (eventId: string) => void;
}

const CalendarioEventos: React.FC<CalendarioEventosProps> = ({ onEventSelect }) => {
  const { events, isLoading } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const eventsWithDates = events.filter(event => event.date);
  
  const getEventsForDate = (date: Date) => {
    return eventsWithDates.filter(event => 
      event.date && isSameDay(parseISO(event.date), date)
    );
  };

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

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendário de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ptBR}
            modifiers={{
              hasEvents: (date) => hasEventsOnDate(date)
            }}
            modifiersStyles={{
              hasEvents: { 
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border"
          />
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>Datas com eventos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate 
              ? `Eventos - ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`
              : 'Selecione uma data'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum evento nesta data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{event.type}</h3>
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusLabel(event.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{format(parseISO(event.date!), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>

                  {event.notes && (
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                      {event.notes}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEventSelect?.(event.id)}
                    >
                      Ver Timeline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarioEventos;
