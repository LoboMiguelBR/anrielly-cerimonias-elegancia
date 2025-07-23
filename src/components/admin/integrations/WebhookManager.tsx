import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Trash2, Edit, Eye } from 'lucide-react';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { WebhookForm } from './forms/WebhookForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const WebhookManager = () => {
  const { webhooks, triggerWebhook, refetch } = useIntegrations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const { toast } = useToast();

  const handleDelete = async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: "Webhook removido com sucesso"
      });
    } catch (error: any) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover webhook",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (webhook: any) => {
    try {
      const { error } = await supabase
        .from('webhook_configs')
        .update({ is_active: !webhook.is_active })
        .eq('id', webhook.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: `Webhook ${webhook.is_active ? 'desativado' : 'ativado'} com sucesso`
      });
    } catch (error: any) {
      console.error('Error toggling webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do webhook",
        variant: "destructive"
      });
    }
  };

  const availableEvents = [
    'lead_created',
    'proposal_created',
    'proposal_approved',
    'contract_signed',
    'event_created',
    'questionnaire_completed',
    'testimonial_submitted'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Webhooks</h2>
          <p className="text-muted-foreground">
            Configure webhooks para enviar dados automaticamente para sistemas externos
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWebhook(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Editar Webhook' : 'Novo Webhook'}
              </DialogTitle>
            </DialogHeader>
            <WebhookForm
              webhook={editingWebhook}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingWebhook(null);
              }}
              availableEvents={availableEvents}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {webhook.name}
                    <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                      {webhook.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {webhook.url}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerWebhook(webhook.id, 'test', { 
                      test: true, 
                      timestamp: new Date().toISOString() 
                    })}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Testar
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalhes do Webhook</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">URL:</h4>
                          <p className="text-sm text-muted-foreground break-all">{webhook.url}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Eventos:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {webhook.events.map((event: string) => (
                              <Badge key={event} variant="outline">{event}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium">Tentativas:</h4>
                            <p className="text-sm text-muted-foreground">{webhook.retry_attempts}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Timeout:</h4>
                            <p className="text-sm text-muted-foreground">{webhook.timeout_seconds}s</p>
                          </div>
                        </div>
                        {webhook.headers && Object.keys(webhook.headers).length > 0 && (
                          <div>
                            <h4 className="font-medium">Headers customizados:</h4>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(webhook.headers, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">Criado em:</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(webhook.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingWebhook(webhook);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(webhook)}
                  >
                    {webhook.is_active ? 'Desativar' : 'Ativar'}
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
                          Tem certeza que deseja excluir o webhook "{webhook.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(webhook.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {webhook.events.map((event: string) => (
                  <Badge key={event} variant="outline">{event}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {webhooks.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum webhook configurado. Clique em "Novo Webhook" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};