import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntegrations } from '@/hooks/integrations/useIntegrations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const integrationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['webhook', 'api', 'oauth']),
  is_active: z.boolean(),
  config: z.string().optional()
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

interface IntegrationFormProps {
  integration?: any;
  onSuccess: () => void;
}

export const IntegrationForm = ({ integration, onSuccess }: IntegrationFormProps) => {
  const { createIntegration, refetch } = useIntegrations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState(integration?.type || 'webhook');

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      name: integration?.name || '',
      type: integration?.type || 'webhook',
      is_active: integration?.is_active ?? true,
      config: integration?.config ? JSON.stringify(integration.config, null, 2) : ''
    }
  });

  const onSubmit = async (data: IntegrationFormData) => {
    setIsSubmitting(true);
    try {
      let config = {};
      if (data.config) {
        try {
          config = JSON.parse(data.config);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Configuração deve estar em formato JSON válido",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      const integrationData = {
        ...data,
        config
      };

      if (integration) {
        // Atualizar integração existente
        const { error } = await supabase
          .from('external_integrations')
          .update(integrationData)
          .eq('id', integration.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Integração atualizada com sucesso"
        });
      } else {
        // Criar nova integração
        await createIntegration(integrationData);
      }

      await refetch();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving integration:', error);
      toast({
        title: "Erro",
        description: integration ? "Erro ao atualizar integração" : "Erro ao criar integração",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfigTemplate = (type: string, name: string) => {
    switch (name.toLowerCase()) {
      case 'zapier':
        return {
          webhook_url: "https://hooks.zapier.com/hooks/catch/your-hook-id"
        };
      case 'google_calendar':
        return {
          calendar_id: "your-calendar-id@gmail.com",
          api_key: "your-google-api-key"
        };
      case 'mailchimp':
        return {
          api_key: "your-mailchimp-api-key",
          list_id: "your-list-id"
        };
      default:
        return {};
    }
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    const template = getConfigTemplate(selectedType, name);
    if (Object.keys(template).length > 0) {
      form.setValue('config', JSON.stringify(template, null, 2));
    }
  };

  const integrationOptions = [
    { value: 'zapier', label: 'Zapier', description: 'Automatize fluxos de trabalho' },
    { value: 'google_calendar', label: 'Google Calendar', description: 'Sincronizar eventos' },
    { value: 'mailchimp', label: 'Mailchimp', description: 'Gerenciar listas de email' },
    { value: 'custom', label: 'Personalizada', description: 'Integração customizada' }
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="integration-type">Tipo de Integração</Label>
          <div className="grid grid-cols-2 gap-3">
            {integrationOptions.map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-colors ${
                  form.watch('name')?.toLowerCase() === option.value ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleNameChange(option.value)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{option.label}</CardTitle>
                  <CardDescription className="text-xs">
                    {option.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nome da integração"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(value: any) => {
                form.setValue('type', value);
                setSelectedType(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="oauth">OAuth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="config">Configuração (JSON)</Label>
          <Textarea
            id="config"
            {...form.register('config')}
            placeholder='{"webhook_url": "https://hooks.zapier.com/hooks/catch/...", "api_key": "..."}'
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Configure as chaves e valores específicos para esta integração
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={form.watch('is_active')}
            onCheckedChange={(checked) => form.setValue('is_active', checked)}
          />
          <Label htmlFor="is_active">Integração ativa</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : integration ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};