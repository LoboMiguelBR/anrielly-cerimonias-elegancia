import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const webhookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  url: z.string().url('URL inválida'),
  events: z.array(z.string()).min(1, 'Selecione pelo menos um evento'),
  is_active: z.boolean(),
  secret_key: z.string().optional(),
  retry_attempts: z.number().min(1).max(10),
  timeout_seconds: z.number().min(1).max(300),
  headers: z.string().optional()
});

type WebhookFormData = z.infer<typeof webhookSchema>;

interface WebhookFormProps {
  webhook?: any;
  onSuccess: () => void;
  availableEvents: string[];
}

export const WebhookForm = ({ webhook, onSuccess, availableEvents }: WebhookFormProps) => {
  const { createWebhook, refetch } = useIntegrations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      name: webhook?.name || '',
      url: webhook?.url || '',
      events: webhook?.events || [],
      is_active: webhook?.is_active ?? true,
      secret_key: webhook?.secret_key || '',
      retry_attempts: webhook?.retry_attempts || 3,
      timeout_seconds: webhook?.timeout_seconds || 30,
      headers: webhook?.headers ? JSON.stringify(webhook.headers, null, 2) : ''
    }
  });

  const onSubmit = async (data: WebhookFormData) => {
    setIsSubmitting(true);
    try {
      let headers = {};
      if (data.headers) {
        try {
          headers = JSON.parse(data.headers);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Headers devem estar em formato JSON válido",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      const webhookData = {
        ...data,
        headers
      };

      if (webhook) {
        // Atualizar webhook existente
        const { error } = await supabase
          .from('webhook_configs')
          .update(webhookData)
          .eq('id', webhook.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Webhook atualizado com sucesso"
        });
      } else {
        // Criar novo webhook
        await createWebhook(webhookData);
      }

      await refetch();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving webhook:', error);
      toast({
        title: "Erro",
        description: webhook ? "Erro ao atualizar webhook" : "Erro ao criar webhook",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvents = form.watch('events');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Nome do webhook"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            {...form.register('url')}
            placeholder="https://example.com/webhook"
          />
          {form.formState.errors.url && (
            <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            Selecione os eventos que irão disparar este webhook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {availableEvents.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <Checkbox
                  id={event}
                  checked={selectedEvents.includes(event)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      form.setValue('events', [...selectedEvents, event]);
                    } else {
                      form.setValue('events', selectedEvents.filter(e => e !== event));
                    }
                  }}
                />
                <Label htmlFor={event} className="text-sm">
                  {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors.events && (
            <p className="text-sm text-destructive mt-2">{form.formState.errors.events.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="retry_attempts">Tentativas</Label>
          <Input
            id="retry_attempts"
            type="number"
            min="1"
            max="10"
            {...form.register('retry_attempts', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeout_seconds">Timeout (segundos)</Label>
          <Input
            id="timeout_seconds"
            type="number"
            min="1"
            max="300"
            {...form.register('timeout_seconds', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secret_key">Chave Secreta (opcional)</Label>
        <Input
          id="secret_key"
          type="password"
          {...form.register('secret_key')}
          placeholder="Para assinatura HMAC SHA-256"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">Headers Customizados (JSON)</Label>
        <Textarea
          id="headers"
          {...form.register('headers')}
          placeholder='{"Authorization": "Bearer token", "X-Custom": "value"}'
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={form.watch('is_active')}
          onCheckedChange={(checked) => form.setValue('is_active', checked)}
        />
        <Label htmlFor="is_active">Webhook ativo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : webhook ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};