
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, FileText, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClienteDashboard = () => {
  const { profile, signOut } = useAuth();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('evento');

  // Filtrar eventos do cliente com verificação de segurança
  const myEvents = events.filter(event => {
    if (!profile) return false;
    
    return event.client_id === profile.id ||
      event.participants?.some(p => 
        p.user_email === profile.email && 
        ['cliente', 'noivo', 'noiva'].includes(p.role)
      );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatEventDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data não definida';
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const formatEventDateFull = (dateString: string | undefined) => {
    if (!dateString) return 'Data não definida';
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Meu Painel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {profile?.name || 'Usuário'}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meu Evento</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myEvents.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questionários</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600">respondidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data do Evento</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {myEvents.length > 0 && myEvents[0].date
                  ? formatEventDate(myEvents[0].date)
                  : 'Não definida'
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <MapPin className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {myEvents.length > 0 ? (
                  <Badge className={getStatusColor(myEvents[0].status)}>
                    {myEvents[0].status}
                  </Badge>
                ) : (
                  'Sem evento'
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button 
            variant={activeTab === 'evento' ? 'default' : 'outline'}
            onClick={() => setActiveTab('evento')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Meu Evento
          </Button>
          <Button 
            variant={activeTab === 'questionarios' ? 'default' : 'outline'}
            onClick={() => setActiveTab('questionarios')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Questionários
          </Button>
        </div>

        {activeTab === 'evento' && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent>
              {myEvents.length > 0 ? (
                <div className="space-y-6">
                  {myEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{event.type}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Informações Gerais</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{formatEventDateFull(event.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{event.location || 'Local não definido'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                          <p className="text-sm text-gray-600">
                            {event.description || 'Nenhuma descrição disponível'}
                          </p>
                          
                          {event.notes && (
                            <>
                              <h4 className="font-medium text-gray-900 mt-4 mb-2">Observações</h4>
                              <p className="text-sm text-gray-600">{event.notes}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
                  <p>Você ainda não tem eventos vinculados à sua conta.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'questionarios' && (
          <Card>
            <CardHeader>
              <CardTitle>Meus Questionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Questionários</h3>
                <p>Aqui você poderá visualizar e editar seus questionários respondidos.</p>
                <Button className="mt-4" variant="outline">
                  Ver Questionários
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ClienteDashboard;
