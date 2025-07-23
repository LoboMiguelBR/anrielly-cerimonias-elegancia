import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('external_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error: any) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar integrações",
        variant: "destructive"
      });
    }
  };

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error: any) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar webhooks",
        variant: "destructive"
      });
    }
  };

  const fetchBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_configs')
        .select(`
          *,
          backup_logs (
            id,
            status,
            backup_size,
            started_at,
            completed_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error: any) {
      console.error('Error fetching backups:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações de backup",
        variant: "destructive"
      });
    }
  };

  const createIntegration = async (integration: any) => {
    try {
      const { data, error } = await supabase
        .from('external_integrations')
        .insert([integration])
        .select()
        .single();

      if (error) throw error;

      await fetchIntegrations();
      toast({
        title: "Sucesso",
        description: "Integração criada com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error creating integration:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar integração",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createWebhook = async (webhook: any) => {
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .insert([webhook])
        .select()
        .single();

      if (error) throw error;

      await fetchWebhooks();
      toast({
        title: "Sucesso",
        description: "Webhook criado com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error creating webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar webhook",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createBackupConfig = async (backup: any) => {
    try {
      const { data, error } = await supabase
        .from('backup_configs')
        .insert([backup])
        .select()
        .single();

      if (error) throw error;

      await fetchBackups();
      toast({
        title: "Sucesso",
        description: "Configuração de backup criada com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error creating backup config:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar configuração de backup",
        variant: "destructive"
      });
      throw error;
    }
  };

  const triggerWebhook = async (webhookId: string, eventType: string, payload: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('webhook-processor', {
        body: {
          action: 'trigger',
          webhook_config_id: webhookId,
          event_type: eventType,
          payload
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Webhook disparado com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error triggering webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao disparar webhook",
        variant: "destructive"
      });
      throw error;
    }
  };

  const syncIntegration = async (integrationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('external-integrations', {
        body: {
          action: 'sync',
          integration_id: integrationId
        }
      });

      if (error) throw error;

      await fetchIntegrations();
      toast({
        title: "Sucesso",
        description: "Integração sincronizada com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error syncing integration:', error);
      toast({
        title: "Erro",
        description: "Erro ao sincronizar integração",
        variant: "destructive"
      });
      throw error;
    }
  };

  const runBackup = async (backupConfigId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: {
          action: 'create',
          backup_config_id: backupConfigId
        }
      });

      if (error) throw error;

      await fetchBackups();
      toast({
        title: "Sucesso",
        description: "Backup iniciado com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error running backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar backup",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchIntegrations(),
        fetchWebhooks(),
        fetchBackups()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    integrations,
    webhooks,
    backups,
    isLoading,
    createIntegration,
    createWebhook,
    createBackupConfig,
    triggerWebhook,
    syncIntegration,
    runBackup,
    refetch: async () => {
      await Promise.all([
        fetchIntegrations(),
        fetchWebhooks(),
        fetchBackups()
      ]);
    }
  };
};