
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventsTable from '../events/EventsTable';
import CreateEventModal from '../events/CreateEventModal';
import { useEvents } from '@/hooks/useEvents';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const EventsTab = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { events, isLoading, refetch } = useEvents();
  const { isMobile } = useMobileLayout();

  const handleEventCreated = () => {
    setShowCreateDialog(false);
    refetch();
  };

  const stats = {
    total: events.length,
    planejamento: events.filter(e => e.status === 'em_planejamento').length,
    confirmados: events.filter(e => e.status === 'confirmado').length,
    andamento: events.filter(e => e.status === 'em_andamento').length,
    concluidos: events.filter(e => e.status === 'concluido').length,
    cancelados: events.filter(e => e.status === 'cancelado').length,
  };

  return (
    <div className={`space-y-4 min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <div className="flex flex-col gap-4 justify-between items-start">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
            {isMobile ? 'Eventos' : 'Gestão de Eventos'}
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Gerencie seus eventos'
              : 'Gerencie eventos e seus participantes'
            }
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className={`bg-purple-500 hover:bg-purple-600 text-white ${isMobile ? 'w-full h-12 text-base' : ''}`}>
              <Plus className="w-4 h-4 mr-2" />
              {isMobile ? 'Novo Evento' : 'Criar Evento'}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh]' : 'sm:max-w-[600px]'}`}>
            <DialogHeader>
              <DialogTitle>{isMobile ? 'Novo Evento' : 'Criar Novo Evento'}</DialogTitle>
            </DialogHeader>
            <CreateEventModal 
              open={showCreateDialog} 
              onOpenChange={setShowCreateDialog} 
              onSuccess={handleEventCreated} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-6'}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <Calendar className="w-4 h-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
              {stats.total}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <Clock className="w-4 h-4" />
              Planejamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-orange-600`}>
              {stats.planejamento}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <CheckCircle className="w-4 h-4" />
              Confirmados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
              {stats.confirmados}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <AlertCircle className="w-4 h-4" />
              Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-yellow-600`}>
              {stats.andamento}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <CheckCircle className="w-4 h-4" />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
              {stats.concluidos}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <XCircle className="w-4 h-4" />
              Cancelados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-red-600`}>
              {stats.cancelados}
            </div>
          </CardContent>
        </Card>
      </div>

      <EventsTable events={events} isLoading={isLoading} onRefresh={refetch} />
    </div>
  );
};

export default EventsTab;
