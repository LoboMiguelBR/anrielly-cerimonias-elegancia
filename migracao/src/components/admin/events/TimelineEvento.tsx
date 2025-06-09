
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useEvents } from '@/hooks/useEvents';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Users,
  FileText,
  Phone,
  Camera,
  Music
} from 'lucide-react';

interface TimelineEventoProps {
  eventId: string;
  onBack?: () => void;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  phase: 'before' | 'during' | 'after';
  icon: React.ReactNode;
  completed: boolean;
}

const TimelineEvento: React.FC<TimelineEventoProps> = ({ eventId, onBack }) => {
  const { getEventById } = useEvents();
  const [event, setEvent] = useState<any>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
      
      if (eventData?.date) {
        generateTimeline(eventData);
      }
    };

    loadEvent();
  }, [eventId, getEventById]);

  const generateTimeline = (eventData: any) => {
    const eventDate = parseISO(eventData.date);
    const daysUntilEvent = differenceInDays(eventDate, new Date());
    
    const baseTimeline: Omit<TimelineItem, 'id' | 'completed'>[] = [
      // Antes do Evento
      {
        title: 'Reunião Inicial',
        description: 'Encontro com os noivos para alinhamento de expectativas',
        date: format(new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: daysUntilEvent > 30 ? 'pending' : 'completed',
        phase: 'before',
        icon: <Users className="w-4 h-4" />
      },
      {
        title: 'Criação do Roteiro',
        description: 'Desenvolvimento do roteiro personalizado da cerimônia',
        date: format(new Date(eventDate.getTime() - 21 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: daysUntilEvent > 21 ? 'pending' : 'completed',
        phase: 'before',
        icon: <FileText className="w-4 h-4" />
      },
      {
        title: 'Visita ao Local',
        description: 'Reconhecimento do local e teste de som',
        date: format(new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: daysUntilEvent > 7 ? 'pending' : 'completed',
        phase: 'before',
        icon: <MapPin className="w-4 h-4" />
      },
      {
        title: 'Ensaio da Cerimônia',
        description: 'Ensaio com noivos e padrinhos',
        date: format(new Date(eventDate.getTime() - 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: daysUntilEvent > 1 ? 'pending' : 'completed',
        phase: 'before',
        icon: <Clock className="w-4 h-4" />
      },
      // Durante o Evento
      {
        title: 'Preparação Final',
        description: 'Chegada antecipada e preparação do ambiente',
        date: eventData.date,
        status: daysUntilEvent > 0 ? 'pending' : daysUntilEvent === 0 ? 'in_progress' : 'completed',
        phase: 'during',
        icon: <AlertCircle className="w-4 h-4" />
      },
      {
        title: 'Cerimônia',
        description: 'Condução da cerimônia',
        date: eventData.date,
        status: daysUntilEvent > 0 ? 'pending' : daysUntilEvent === 0 ? 'in_progress' : 'completed',
        phase: 'during',
        icon: <Calendar className="w-4 h-4" />
      },
      // Depois do Evento
      {
        title: 'Relatório de Feedback',
        description: 'Coleta de feedback dos noivos e fornecedores',
        date: format(new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        status: daysUntilEvent < -3 ? 'completed' : 'pending',
        phase: 'after',
        icon: <FileText className="w-4 h-4" />
      }
    ];

    const itemsWithIds = baseTimeline.map((item, index) => ({
      ...item,
      id: `timeline-${index}`,
      completed: item.status === 'completed'
    }));

    setTimelineItems(itemsWithIds);
  };

  const toggleItemCompleted = (itemId: string) => {
    setTimelineItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, completed: !item.completed, status: !item.completed ? 'completed' : 'pending' }
          : item
      )
    );
  };

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case 'before':
        return 'Antes do Evento';
      case 'during':
        return 'Durante o Evento';
      case 'after':
        return 'Depois do Evento';
      default:
        return '';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'before':
        return 'border-l-blue-500';
      case 'during':
        return 'border-l-green-500';
      case 'after':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    
    switch (status) {
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!event) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const groupedItems = timelineItems.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = [];
    }
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);

  return (
    <div className="space-y-6">
      {/* Header do Evento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline - {event.type}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(parseISO(event.date), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Voltar
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Timeline por Fases */}
      {(['before', 'during', 'after'] as const).map((phase) => (
        <Card key={phase} className={`border-l-4 ${getPhaseColor(phase)}`}>
          <CardHeader>
            <CardTitle className="text-lg">{getPhaseTitle(phase)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedItems[phase]?.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompleted(item.id)}
                    />
                    {getStatusIcon(item.status, item.completed)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon}
                      <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className={`text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TimelineEvento;
