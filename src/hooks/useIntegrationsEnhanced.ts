
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para integrações
export type IntegrationStatus = 'active' | 'inactive' | 'pending' | 'error';

export interface Integration {
  id: string;
  name: string;
  category: string;
  description?: string;
  status: IntegrationStatus;
  enabled: boolean;
  logo_url?: string;
  documentation_url?: string;
  features: string[];
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  config_schema: Record<string, any>;
}

export const useIntegrationsEnhanced = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Type cast para garantir compatibilidade com nossos tipos
      const typedIntegrations: Integration[] = (data || []).map(integration => ({
        ...integration,
        status: integration.status as IntegrationStatus,
        config: typeof integration.config === 'object' ? integration.config as Record<string, any> : {}
      }));
      
      setIntegrations(typedIntegrations);
    } catch (error: any) {
      console.error('Erro ao buscar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (id: string) => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) return;

      const newEnabled = !integration.enabled;
      const newStatus: IntegrationStatus = newEnabled ? 'active' : 'inactive';

      const { error } = await supabase
        .from('integrations')
        .update({ 
          enabled: newEnabled,
          status: newStatus as string // Cast para string
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Integração ${newEnabled ? 'ativada' : 'desativada'} com sucesso!`);
      await fetchIntegrations();
    } catch (error: any) {
      console.error('Erro ao alterar integração:', error);
      toast.error('Erro ao alterar integração');
    }
  };

  const configureIntegration = async (id: string, config?: Record<string, any>) => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) return;

      console.log('Configurando integração:', integration.name);
      
      if (config) {
        const { error } = await supabase
          .from('integrations')
          .update({ config })
          .eq('id', id);

        if (error) throw error;
        
        await fetchIntegrations();
        toast.success('Configuração salva com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao configurar integração:', error);
      toast.error('Erro ao configurar integração');
    }
  };

  const fetchTemplates = async () => {
    // Mock data para templates - pode ser substituído por dados reais
    const mockTemplates: IntegrationTemplate[] = [
      {
        id: '1',
        name: 'Stripe Payment',
        category: 'Pagamentos',
        description: 'Template para integração com Stripe',
        config_schema: {
          api_key: { type: 'string', required: true },
          webhook_url: { type: 'string', required: false }
        }
      },
      {
        id: '2',
        name: 'OpenAI Assistant',
        category: 'AI/ML',
        description: 'Template para integração com OpenAI',
        config_schema: {
          api_key: { type: 'string', required: true },
          model: { type: 'string', required: false, default: 'gpt-3.5-turbo' }
        }
      },
      {
        id: '3',
        name: 'Resend Email',
        category: 'Email',
        description: 'Template para integração com Resend',
        config_schema: {
          api_key: { type: 'string', required: true },
          from_email: { type: 'string', required: true }
        }
      }
    ];
    setTemplates(mockTemplates);
  };

  const createIntegration = async (data: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const insertData = {
        ...data,
        status: data.status as string // Cast para string
      };

      const { error } = await supabase
        .from('integrations')
        .insert([insertData]);

      if (error) throw error;

      toast.success('Integração criada com sucesso!');
      await fetchIntegrations();
    } catch (error: any) {
      console.error('Erro ao criar integração:', error);
      toast.error('Erro ao criar integração');
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Integração removida com sucesso!');
      await fetchIntegrations();
    } catch (error: any) {
      console.error('Erro ao remover integração:', error);
      toast.error('Erro ao remover integração');
    }
  };

  const updateIntegrationStatus = async (id: string, status: IntegrationStatus) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ status: status as string }) // Cast para string
        .eq('id', id);

      if (error) throw error;

      toast.success('Status da integração atualizado!');
      await fetchIntegrations();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const refetch = async () => {
    await Promise.all([fetchIntegrations(), fetchTemplates()]);
  };

  useEffect(() => {
    fetchIntegrations();
    fetchTemplates();
  }, []);

  return {
    integrations,
    templates,
    loading,
    fetchIntegrations,
    fetchTemplates,
    toggleIntegration,
    configureIntegration,
    createIntegration,
    deleteIntegration,
    updateIntegrationStatus,
    refetch
  };
};
