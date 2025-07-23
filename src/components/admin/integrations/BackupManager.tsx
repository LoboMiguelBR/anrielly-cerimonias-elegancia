import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Trash2, Edit, Download, Clock } from 'lucide-react';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { BackupForm } from './forms/BackupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BackupManager = () => {
  const { backups, runBackup, refetch } = useIntegrations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBackup, setEditingBackup] = useState<any>(null);
  const { toast } = useToast();

  const handleDelete = async (backupId: string) => {
    try {
      const { error } = await supabase
        .from('backup_configs')
        .delete()
        .eq('id', backupId);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: "Configuração de backup removida com sucesso"
      });
    } catch (error: any) {
      console.error('Error deleting backup config:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover configuração de backup",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (backup: any) => {
    try {
      const { error } = await supabase
        .from('backup_configs')
        .update({ is_active: !backup.is_active })
        .eq('id', backup.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: `Backup ${backup.is_active ? 'desativado' : 'ativado'} com sucesso`
      });
    } catch (error: any) {
      console.error('Error toggling backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do backup",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Concluído</Badge>;
      case 'running':
        return <Badge variant="secondary">Executando</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Backups Automáticos</h2>
          <p className="text-muted-foreground">
            Configure backups automáticos dos dados da plataforma
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBackup(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBackup ? 'Editar Configuração' : 'Nova Configuração de Backup'}
              </DialogTitle>
            </DialogHeader>
            <BackupForm
              backup={editingBackup}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingBackup(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {backups.map((backup) => (
          <Card key={backup.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {backup.name}
                    {getStatusBadge(backup.backup_status)}
                    {!backup.is_active && (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Tipo: {backup.backup_type} • 
                    Retenção: {backup.retention_days} dias • 
                    {backup.last_backup 
                      ? ` Último backup: ${format(new Date(backup.last_backup), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
                      : ' Nenhum backup executado'
                    }
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runBackup(backup.id)}
                    disabled={backup.backup_status === 'running' || !backup.is_active}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Executar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingBackup(backup);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(backup)}
                  >
                    {backup.is_active ? 'Desativar' : 'Ativar'}
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
                          Tem certeza que deseja excluir a configuração de backup "{backup.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(backup.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Agendamento
                    </h4>
                    <p className="text-sm text-muted-foreground">{backup.schedule_cron}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Local de armazenamento</h4>
                    <p className="text-sm text-muted-foreground">{backup.storage_location}</p>
                  </div>
                </div>

                {backup.backup_logs && backup.backup_logs.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Backups recentes</h4>
                    <div className="space-y-2">
                      {backup.backup_logs.slice(0, 3).map((log: any) => (
                        <div 
                          key={log.id} 
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {format(new Date(log.started_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.backup_size && formatFileSize(log.backup_size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={log.status === 'completed' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {log.status === 'completed' ? 'Sucesso' : 'Falhou'}
                            </Badge>
                            {log.status === 'completed' && (
                              <Button size="sm" variant="ghost">
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {backups.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma configuração de backup criada. Clique em "Nova Configuração" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};