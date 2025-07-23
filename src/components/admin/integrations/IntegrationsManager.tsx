import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Webhook, Zap, Database, Settings, Play, RefreshCw } from 'lucide-react';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { WebhookManager } from './WebhookManager';
import { ExternalIntegrationsManager } from './ExternalIntegrationsManager';
import { BackupManager } from './BackupManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const IntegrationsManager = () => {
  const { 
    integrations, 
    webhooks, 
    backups, 
    isLoading,
    triggerWebhook,
    syncIntegration,
    runBackup
  } = useIntegrations();

  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeIntegrations = integrations.filter(i => i.is_active);
  const activeWebhooks = webhooks.filter(w => w.is_active);
  const activeBackups = backups.filter(b => b.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
        <p className="text-muted-foreground">
          Gerencie webhooks, integrações externas e backups automáticos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Webhooks Ativos</CardTitle>
                <Webhook className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeWebhooks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {webhooks.length} total configurados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeIntegrations.length}</div>
                <p className="text-xs text-muted-foreground">
                  {integrations.length} total configuradas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backups Ativos</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeBackups.length}</div>
                <p className="text-xs text-muted-foreground">
                  {backups.length} total configurados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status das integrações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhooks Recentes</CardTitle>
                <CardDescription>
                  Status dos webhooks configurados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeWebhooks.slice(0, 5).map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{webhook.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {webhook.events.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerWebhook(webhook.id, 'test', { test: true })}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {activeWebhooks.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum webhook configurado
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrações Externas</CardTitle>
                <CardDescription>
                  Status das integrações com serviços externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeIntegrations.slice(0, 5).map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.last_sync 
                          ? `Última sync: ${format(new Date(integration.last_sync), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
                          : 'Nunca sincronizado'
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          integration.sync_status === 'idle' ? 'default' :
                          integration.sync_status === 'syncing' ? 'secondary' : 'destructive'
                        }
                      >
                        {integration.sync_status === 'idle' ? 'OK' :
                         integration.sync_status === 'syncing' ? 'Sincronizando' : 'Erro'
                        }
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncIntegration(integration.id)}
                        disabled={integration.sync_status === 'syncing'}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {activeIntegrations.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma integração configurada
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>

        <TabsContent value="integrations">
          <ExternalIntegrationsManager />
        </TabsContent>

        <TabsContent value="backups">
          <BackupManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};