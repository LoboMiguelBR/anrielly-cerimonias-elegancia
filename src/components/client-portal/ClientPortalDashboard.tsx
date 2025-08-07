import { useState } from 'react';
import { useClientPortalAuth } from '@/hooks/client-portal/useClientPortalAuth';
import { useClientPortalData } from '@/hooks/client-portal/useClientPortalData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  Calendar, 
  FileText, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Heart,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { ClientPortalTimeline } from './ClientPortalTimeline';
import { ClientPortalDocuments } from './ClientPortalDocuments';
import { ClientPortalMessages } from './ClientPortalMessages';
import { ClientPortalNotifications } from './ClientPortalNotifications';

export const ClientPortalDashboard = () => {
  const { session, logout } = useClientPortalAuth();
  const { 
    notifications, 
    timeline, 
    documents, 
    messages, 
    loading,
    unreadNotifications,
    unreadMessages
  } = useClientPortalData(session?.client?.id);

  const [activeTab, setActiveTab] = useState('overview');

  if (!session) {
    return null;
  }

  const { client } = session;

  // Estatísticas do dashboard
  const stats = {
    completedTasks: timeline.filter(t => t.status === 'completed').length,
    pendingTasks: timeline.filter(t => t.status === 'pending').length,
    totalDocuments: documents.length,
    unreadMessages
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Portal do Cliente</h1>
                <p className="text-sm text-muted-foreground">Bem-vindo, {client.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2 relative">
              <MessageCircle className="h-4 w-4" />
              <span>Mensagens</span>
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2 relative">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.completedTasks}</p>
                      <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                      <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                      <p className="text-sm text-muted-foreground">Documentos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                      <p className="text-sm text-muted-foreground">Mensagens Novas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações do Evento */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
                <CardDescription>Detalhes do seu evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Evento</p>
                    <p className="text-lg">{client.event_type}</p>
                  </div>
                  {client.event_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data do Evento</p>
                      <p className="text-lg">{new Date(client.event_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                  {client.event_location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Local</p>
                      <p className="text-lg">{client.event_location}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant="default">{client.status || 'Ativo'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Últimas Atividades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeline
                      .filter(t => t.status === 'pending')
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            {item.due_date && (
                              <p className="text-sm text-muted-foreground">
                                Prazo: {new Date(item.due_date).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    {timeline.filter(t => t.status === 'pending').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Nenhuma tarefa pendente</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Nenhum documento disponível</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <ClientPortalTimeline timeline={timeline} loading={loading} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <ClientPortalDocuments documents={documents} loading={loading} />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <ClientPortalMessages 
              messages={messages} 
              loading={loading}
              clientName={client.name}
            />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <ClientPortalNotifications 
              notifications={notifications} 
              loading={loading} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};