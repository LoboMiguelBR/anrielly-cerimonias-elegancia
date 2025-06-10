
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Integration, IntegrationTemplate } from '@/types/integrations';

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
      setIntegrations(data || []);
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

      const { error } = await supabase
        .from('integrations')
        .update({ 
          enabled: !integration.enabled,
          status: !integration.enabled ? 'active' : 'inactive'
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Integração ${!integration.enabled ? 'ativada' : 'desativada'} com sucesso!`);
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

      // Aqui você pode implementar a lógica específica de configuração
      // Por exemplo, abrir um modal de configuração
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
      }
    ];
    setTemplates(mockTemplates);
  };

  const createIntegration = async (data: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .insert([data]);

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
    refetch
  };
};
