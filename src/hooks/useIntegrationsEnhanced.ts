
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExternalApiConfig, WebhookConfig } from '@/types/shared';

export interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'payment' | 'email' | 'crm' | 'analytics' | 'storage' | 'communication' | 'ai';
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: ExternalApiConfig;
  features: IntegrationFeature[];
  webhook_config?: WebhookConfig;
  last_sync?: string;
  error_message?: string;
  usage_stats?: UsageStats;
  created_at: string;
  updated_at: string;
}

export interface IntegrationFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface UsageStats {
  requests_today: number;
  requests_this_month: number;
  success_rate: number;
  average_response_time: number;
  last_error?: string;
  quota_used: number;
  quota_limit: number;
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  provider: string;
  type: string;
  description: string;
  logo_url: string;
  setup_steps: SetupStep[];
  required_fields: FieldConfig[];
  optional_fields: FieldConfig[];
  features: string[];
  pricing_info?: string;
  documentation_url?: string;
}

export interface SetupStep {
  step: number;
  title: string;
  description: string;
  action?: string;
  validation?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select' | 'boolean';
  description: string;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

export const useIntegrationsEnhanced = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      
      // Mock integrations data - will be stored in database
      const mockIntegrations: Integration[] = [
        {
          id: 'stripe-payment',
          name: 'Stripe',
          provider: 'Stripe Inc.',
          type: 'payment',
          status: 'active',
          config: {
            api_key: 'sk_test_***',
            base_url: 'https://api.stripe.com/v1',
            timeout: 30000,
            retry_attempts: 3,
            headers: {
              'Authorization': 'Bearer sk_test_***'
            }
          },
          features: [
            {
              id: 'payment-processing',
              name: 'Processamento de Pagamentos',
              description: 'Processar pagamentos via cartão de crédito',
              enabled: true
            },
            {
              id: 'recurring-billing',
              name: 'Cobrança Recorrente',
              description: 'Configurar cobranças automáticas',
              enabled: false
            }
          ],
          usage_stats: {
            requests_today: 45,
            requests_this_month: 1234,
            success_rate: 99.2,
            average_response_time: 245,
            quota_used: 1234,
            quota_limit: 10000
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'resend-email',
          name: 'Resend',
          provider: 'Resend',
          type: 'email',
          status: 'active',
          config: {
            api_key: 're_***',
            base_url: 'https://api.resend.com',
            timeout: 15000,
            retry_attempts: 2
          },
          features: [
            {
              id: 'transactional-emails',
              name: 'Emails Transacionais',
              description: 'Envio de emails automáticos',
              enabled: true
            },
            {
              id: 'email-templates',
              name: 'Templates de Email',
              description: 'Gerenciar templates personalizados',
              enabled: true
            }
          ],
          usage_stats: {
            requests_today: 23,
            requests_this_month: 567,
            success_rate: 98.5,
            average_response_time: 1200,
            quota_used: 567,
            quota_limit: 5000
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setIntegrations(mockIntegrations);
    } catch (error: any) {
      console.error('Erro ao buscar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const mockTemplates: IntegrationTemplate[] = [
        {
          id: 'stripe-template',
          name: 'Stripe',
          provider: 'Stripe Inc.',
          type: 'payment',
          description: 'Aceite pagamentos online de forma segura',
          logo_url: '/integration-logos/stripe.png',
          setup_steps: [
            {
              step: 1,
              title: 'Criar conta no Stripe',
              description: 'Acesse stripe.com e crie sua conta',
              action: 'https://stripe.com/register'
            },
            {
              step: 2,
              title: 'Obter chaves da API',
              description: 'Copie suas chaves da API no painel do Stripe',
              action: 'https://dashboard.stripe.com/apikeys'
            },
            {
              step: 3,
              title: 'Configurar webhook',
              description: 'Configure o endpoint para receber notificações',
              validation: 'webhook_url_test'
            }
          ],
          required_fields: [
            {
              name: 'publishable_key',
              label: 'Chave Pública',
              type: 'text',
              description: 'Sua chave pública do Stripe (pk_...)',
              placeholder: 'pk_test_...'
            },
            {
              name: 'secret_key',
              label: 'Chave Secreta',
              type: 'password',
              description: 'Sua chave secreta do Stripe (sk_...)',
              placeholder: 'sk_test_...'
            }
          ],
          optional_fields: [
            {
              name: 'webhook_secret',
              label: 'Segredo do Webhook',
              type: 'password',
              description: 'Segredo para validar webhooks (whsec_...)',
              placeholder: 'whsec_...'
            }
          ],
          features: [
            'Processamento de pagamentos',
            'Assinaturas recorrentes',
            'Reembolsos automáticos',
            'Relatórios financeiros'
          ],
          pricing_info: 'Taxa de 3,4% + R$ 0,40 por transação',
          documentation_url: 'https://stripe.com/docs'
        },
        {
          id: 'openai-template',
          name: 'OpenAI',
          provider: 'OpenAI',
          type: 'ai',
          description: 'Inteligência artificial para automação e insights',
          logo_url: '/integration-logos/openai.png',
          setup_steps: [
            {
              step: 1,
              title: 'Criar conta na OpenAI',
              description: 'Acesse platform.openai.com e crie sua conta',
              action: 'https://platform.openai.com/signup'
            },
            {
              step: 2,
              title: 'Gerar chave da API',
              description: 'Crie uma nova chave de API no painel',
              action: 'https://platform.openai.com/api-keys'
            }
          ],
          required_fields: [
            {
              name: 'api_key',
              label: 'Chave da API',
              type: 'password',
              description: 'Sua chave da API da OpenAI',
              placeholder: 'sk-...'
            }
          ],
          optional_fields: [
            {
              name: 'model',
              label: 'Modelo',
              type: 'select',
              description: 'Modelo de IA a ser usado',
              options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
            }
          ],
          features: [
            'Geração de conteúdo',
            'Análise de sentimentos',
            'Chatbot inteligente',
            'Personalização automática'
          ],
          pricing_info: 'Baseado no uso - consulte openai.com/pricing',
          documentation_url: 'https://platform.openai.com/docs'
        }
      ];

      setTemplates(mockTemplates);
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error);
    }
  };

  const createIntegration = async (templateId: string, config: Record<string, any>) => {
    try {
      setLoading(true);
      
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template não encontrado');
      }

      const newIntegration: Integration = {
        id: `${template.provider.toLowerCase()}-${Date.now()}`,
        name: template.name,
        provider: template.provider,
        type: template.type as any,
        status: 'pending',
        config: {
          api_key: config.api_key || config.secret_key,
          base_url: getProviderBaseUrl(template.provider),
          timeout: 30000,
          retry_attempts: 3,
          headers: {}
        },
        features: template.features.map(feature => ({
          id: feature.toLowerCase().replace(/\s+/g, '-'),
          name: feature,
          description: `Funcionalidade: ${feature}`,
          enabled: true
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Validate configuration
      const isValid = await validateIntegration(newIntegration);
      if (isValid) {
        newIntegration.status = 'active';
        toast.success('Integração criada e ativada com sucesso!');
      } else {
        newIntegration.status = 'error';
        newIntegration.error_message = 'Falha na validação da configuração';
        toast.error('Integração criada mas com erro de configuração');
      }

      setIntegrations(prev => [...prev, newIntegration]);
      return newIntegration;
    } catch (error: any) {
      console.error('Erro ao criar integração:', error);
      toast.error('Erro ao criar integração');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateIntegration = async (id: string, updates: Partial<Integration>) => {
    try {
      setLoading(true);
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, ...updates, updated_at: new Date().toISOString() }
          : integration
      ));

      toast.success('Integração atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar integração:', error);
      toast.error('Erro ao atualizar integração');
    } finally {
      setLoading(false);
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      setLoading(true);
      
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      
      toast.success('Integração removida com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover integração:', error);
      toast.error('Erro ao remover integração');
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (id: string): Promise<boolean> => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) {
        throw new Error('Integração não encontrada');
      }

      // Mock test - will implement actual API calls
      const isValid = await validateIntegration(integration);
      
      if (isValid) {
        await updateIntegration(id, { 
          status: 'active',
          error_message: undefined,
          last_sync: new Date().toISOString()
        });
        toast.success('Teste da integração passou!');
        return true;
      } else {
        await updateIntegration(id, { 
          status: 'error',
          error_message: 'Falha no teste de conectividade'
        });
        toast.error('Teste da integração falhou');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao testar integração:', error);
      toast.error('Erro ao testar integração');
      return false;
    }
  };

  const validateIntegration = async (integration: Integration): Promise<boolean> => {
    // Mock validation logic
    return integration.config.api_key && integration.config.api_key.length > 10;
  };

  const getProviderBaseUrl = (provider: string): string => {
    const urls: Record<string, string> = {
      'Stripe Inc.': 'https://api.stripe.com/v1',
      'Resend': 'https://api.resend.com',
      'OpenAI': 'https://api.openai.com/v1',
      'WhatsApp Business': 'https://graph.facebook.com/v17.0',
      'Google Analytics': 'https://analyticsreporting.googleapis.com/v4'
    };
    
    return urls[provider] || 'https://api.example.com';
  };

  const syncIntegrations = async () => {
    try {
      setLoading(true);
      
      for (const integration of integrations) {
        if (integration.status === 'active') {
          // Mock sync process
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await updateIntegration(integration.id, {
            last_sync: new Date().toISOString(),
            usage_stats: {
              ...integration.usage_stats,
              requests_today: (integration.usage_stats?.requests_today || 0) + Math.floor(Math.random() * 5),
              success_rate: 95 + Math.random() * 5
            }
          });
        }
      }
      
      toast.success('Sincronização concluída!');
    } catch (error: any) {
      console.error('Erro ao sincronizar:', error);
      toast.error('Erro na sincronização');
    } finally {
      setLoading(false);
    }
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
    createIntegration,
    updateIntegration,
    deleteIntegration,
    testIntegration,
    syncIntegrations,
    refetch: fetchIntegrations
  };
};
