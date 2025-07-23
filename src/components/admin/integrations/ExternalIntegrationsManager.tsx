import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Trash2, Edit, Settings } from 'lucide-react';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { IntegrationForm } from './forms/IntegrationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ExternalIntegrationsManager = () => {
  const { integrations, syncIntegration, refetch } = useIntegrations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);
  const { toast } = useToast();

  const handleDelete = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('external_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: "Integração removida com sucesso"
      });
    } catch (error: any) {
      console.error('Error deleting integration:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover integração",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (integration: any) => {
    try {
      const { error } = await supabase
        .from('external_integrations')
        .update({ is_active: !integration.is_active })
        .eq('id', integration.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: `Integração ${integration.is_active ? 'desativada' : 'ativada'} com sucesso`
      });
    } catch (error: any) {
      console.error('Error toggling integration:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da integração",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'idle':
        return <Badge variant="default">Ativo</Badge>;
      case 'syncing':
        return <Badge variant="secondary">Sincronizando</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getIntegrationIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'zapier':
        return '⚡';
      case 'google_calendar':
        return '📅';
      case 'mailchimp':
        return '📧';
      default:
        return '🔗';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrações Externas</h2>
          <p className="text-muted-foreground">
            Conecte com serviços externos como Zapier, Google Calendar e Mailchimp
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingIntegration(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Editar Integração' : 'Nova Integração'}
              </DialogTitle>
            </DialogHeader>
            <IntegrationForm
              integration={editingIntegration}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingIntegration(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getIntegrationIcon(integration.name)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {integration.name}
                      {getStatusBadge(integration.sync_status)}
                      {!integration.is_active && (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Tipo: {integration.type} • 
                      {integration.last_sync 
                        ? ` Última sync: ${format(new Date(integration.last_sync), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
                        : ' Nunca sincronizado'
                      }
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => syncIntegration(integration.id)}
                    disabled={integration.sync_status === 'syncing' || !integration.is_active}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Sincronizar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingIntegration(integration);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(integration)}
                  >
                    {integration.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a integração "{integration.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(integration.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {integration.sync_error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded p-3 mb-4">
                  <p className="text-sm text-destructive font-medium">Erro de sincronização:</p>
                  <p className="text-sm text-destructive mt-1">{integration.sync_error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium">Configurações:</h4>
                {integration.name.toLowerCase() === 'zapier' && integration.config.webhook_url && (
                  <div>
                    <span className="text-sm font-medium">Webhook URL: </span>
                    <span className="text-sm text-muted-foreground break-all">
                      {integration.config.webhook_url}
                    </span>
                  </div>
                )}
                {Object.keys(integration.config).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma configuração definida</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {integrations.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma integração configurada. Clique em "Nova Integração" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};