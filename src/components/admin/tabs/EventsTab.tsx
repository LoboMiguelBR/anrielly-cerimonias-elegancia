import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventsTable from '../events/EventsTable';
import CreateEventModal from '../events/CreateEventModal';
import { useEvents } from '@/hooks/useEvents';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { useAuth } from '@/hooks/useAuth';

const EventsTab = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { events, isLoading, error, refetch } = useEvents();
  const { isMobile } = useMobileLayout();
  const { profile, isAuthenticated } = useAuth();

  // Debug logs
  useEffect(() => {
    console.log('EventsTab - Debug Info:', {
      isAuthenticated,
      profile: profile ? { id: profile.id, role: profile.role, email: profile.email } : null,
      eventsCount: events?.length || 0,
      isLoading,
      error: error?.message || error
    });
  }, [isAuthenticated, profile, events, isLoading, error]);

  const handleEventCreated = () => {
    setShowCreateDialog(false);
    refetch();
  };

  // Verificação de autenticação
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-gray-600">Você precisa estar logado para acessar esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificação de permissão admin
  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">Apenas administradores podem acessar a gestão de eventos.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tratamento de erro
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Eventos</h3>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Ocorreu um erro ao carregar os eventos.'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: events?.length || 0,
    planejamento: events?.filter(e => e.status === 'em_planejamento').length || 0,
    confirmados: events?.filter(e => e.status === 'confirmado').length || 0,
    andamento: events?.filter(e => e.status === 'em_andamento').length || 0,
    concluidos: events?.filter(e => e.status === 'concluido').length || 0,
    cancelados: events?.filter(e => e.status === 'cancelado').length || 0,
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
          <CreateEventModal 
            open={showCreateDialog} 
            onOpenChange={setShowCreateDialog} 
            onSuccess={handleEventCreated} 
          />
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

      <EventsTable events={events || []} isLoading={isLoading} onRefresh={() => refetch()} />
    </div>
  );
};

export default EventsTab;
