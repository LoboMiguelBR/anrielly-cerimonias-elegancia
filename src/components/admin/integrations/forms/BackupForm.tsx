import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const backupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  backup_type: z.enum(['full', 'data_only', 'schema_only']),
  schedule_cron: z.string().min(1, 'Agendamento é obrigatório'),
  storage_location: z.string().min(1, 'Local de armazenamento é obrigatório'),
  retention_days: z.number().min(1).max(365),
  is_active: z.boolean()
});

type BackupFormData = z.infer<typeof backupSchema>;

interface BackupFormProps {
  backup?: any;
  onSuccess: () => void;
}

export const BackupForm = ({ backup, onSuccess }: BackupFormProps) => {
  const { createBackupConfig, refetch } = useIntegrations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BackupFormData>({
    resolver: zodResolver(backupSchema),
    defaultValues: {
      name: backup?.name || '',
      backup_type: backup?.backup_type || 'full',
      schedule_cron: backup?.schedule_cron || '0 2 * * *', // Diário às 2h da manhã
      storage_location: backup?.storage_location || 'supabase_storage',
      retention_days: backup?.retention_days || 30,
      is_active: backup?.is_active ?? true
    }
  });

  const onSubmit = async (data: BackupFormData) => {
    setIsSubmitting(true);
    try {
      if (backup) {
        // Atualizar backup existente
        const { error } = await supabase
          .from('backup_configs')
          .update(data)
          .eq('id', backup.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração de backup atualizada com sucesso"
        });
      } else {
        // Criar novo backup
        await createBackupConfig(data);
      }

      await refetch();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving backup config:', error);
      toast({
        title: "Erro",
        description: backup ? "Erro ao atualizar configuração" : "Erro ao criar configuração",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const schedulePresets = [
    { value: '0 2 * * *', label: 'Diário (2h da manhã)' },
    { value: '0 2 * * 0', label: 'Semanal (Domingo, 2h)' },
    { value: '0 2 1 * *', label: 'Mensal (Dia 1, 2h)' },
    { value: '0 */6 * * *', label: 'A cada 6 horas' },
    { value: '0 */12 * * *', label: 'A cada 12 horas' }
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Nome da configuração de backup"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backup_type">Tipo de Backup</Label>
            <Select
              value={form.watch('backup_type')}
              onValueChange={(value: any) => form.setValue('backup_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Completo</SelectItem>
                <SelectItem value="data_only">Apenas Dados</SelectItem>
                <SelectItem value="schema_only">Apenas Esquema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_location">Local de Armazenamento</Label>
            <Select
              value={form.watch('storage_location')}
              onValueChange={(value: any) => form.setValue('storage_location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase_storage">Supabase Storage</SelectItem>
                <SelectItem value="external_s3">S3 Externo</SelectItem>
                <SelectItem value="google_drive">Google Drive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule_cron">Agendamento</Label>
          <Select
            value={form.watch('schedule_cron')}
            onValueChange={(value: any) => form.setValue('schedule_cron', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              {schedulePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...form.register('schedule_cron')}
            placeholder="0 2 * * * (formato cron)"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground">
            Expressão cron para agendamento. Exemplo: "0 2 * * *" = todo dia às 2h
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention_days">Retenção (dias)</Label>
          <Input
            id="retention_days"
            type="number"
            min="1"
            max="365"
            {...form.register('retention_days', { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground">
            Por quantos dias manter os backups antes de excluir automaticamente
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={form.watch('is_active')}
            onCheckedChange={(checked) => form.setValue('is_active', checked)}
          />
          <Label htmlFor="is_active">Backup ativo</Label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Completo:</strong> Inclui estrutura e dados de todas as tabelas</p>
          <p>• <strong>Apenas Dados:</strong> Exporta somente os dados, sem estrutura</p>
          <p>• <strong>Apenas Esquema:</strong> Exporta somente a estrutura das tabelas</p>
          <p>• Os backups são executados automaticamente no horário agendado</p>
          <p>• Backups antigos são removidos automaticamente após o período de retenção</p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : backup ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};