import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface IntegrationRequest {
  integration_id: string;
  action: string;
  data?: any;
}

async function syncZapierIntegration(integration: any, data?: any) {
  try {
    const config = integration.config;
    const webhookUrl = config.webhook_url;

    if (!webhookUrl) {
      throw new Error('Webhook URL not configured for Zapier integration');
    }

    // Preparar dados para envio
    const payload = {
      integration_name: integration.name,
      timestamp: new Date().toISOString(),
      event_type: data?.event_type || 'sync',
      data: data || {}
    };

    console.log('Sending data to Zapier:', webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lovable-Integration/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.status} ${response.statusText}`);
    }

    // Atualizar status da integração
    await supabase
      .from('external_integrations')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: 'idle',
        sync_error: null
      })
      .eq('id', integration.id);

    return { success: true, response_status: response.status };

  } catch (error: any) {
    console.error('Zapier integration error:', error);

    await supabase
      .from('external_integrations')
      .update({
        sync_status: 'error',
        sync_error: error.message
      })
      .eq('id', integration.id);

    throw error;
  }
}

async function syncGoogleCalendarIntegration(integration: any, data?: any) {
  try {
    // Placeholder para integração com Google Calendar
    // Aqui seria implementada a lógica para sincronizar eventos
    console.log('Google Calendar integration not yet implemented');
    
    await supabase
      .from('external_integrations')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: 'idle',
        sync_error: 'Not implemented'
      })
      .eq('id', integration.id);

    return { success: false, message: 'Google Calendar integration not yet implemented' };

  } catch (error: any) {
    console.error('Google Calendar integration error:', error);
    throw error;
  }
}

async function syncMailchimpIntegration(integration: any, data?: any) {
  try {
    // Placeholder para integração com Mailchimp
    // Aqui seria implementada a lógica para sincronizar contatos
    console.log('Mailchimp integration not yet implemented');
    
    await supabase
      .from('external_integrations')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: 'idle',
        sync_error: 'Not implemented'
      })
      .eq('id', integration.id);

    return { success: false, message: 'Mailchimp integration not yet implemented' };

  } catch (error: any) {
    console.error('Mailchimp integration error:', error);
    throw error;
  }
}

async function syncIntegration(integrationId: string, action: string, data?: any) {
  try {
    // Marcar como sincronizando
    await supabase
      .from('external_integrations')
      .update({ sync_status: 'syncing' })
      .eq('id', integrationId);

    // Buscar configuração da integração
    const { data: integration, error } = await supabase
      .from('external_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('is_active', true)
      .single();

    if (error || !integration) {
      throw new Error('Integration not found or inactive');
    }

    let result;

    switch (integration.name.toLowerCase()) {
      case 'zapier':
        result = await syncZapierIntegration(integration, data);
        break;
      case 'google_calendar':
        result = await syncGoogleCalendarIntegration(integration, data);
        break;
      case 'mailchimp':
        result = await syncMailchimpIntegration(integration, data);
        break;
      default:
        throw new Error(`Unknown integration type: ${integration.name}`);
    }

    return result;

  } catch (error: any) {
    console.error('Integration sync error:', error);

    await supabase
      .from('external_integrations')
      .update({
        sync_status: 'error',
        sync_error: error.message
      })
      .eq('id', integrationId);

    throw error;
  }
}

async function processAllIntegrations() {
  try {
    // Buscar todas as integrações ativas
    const { data: integrations, error } = await supabase
      .from('external_integrations')
      .select('*')
      .eq('is_active', true)
      .not('sync_status', 'eq', 'syncing');

    if (error) throw error;

    const results = [];

    for (const integration of integrations || []) {
      try {
        const result = await syncIntegration(integration.id, 'sync');
        results.push({ integration_id: integration.id, ...result });
      } catch (error: any) {
        results.push({ 
          integration_id: integration.id, 
          success: false, 
          error: error.message 
        });
      }
    }

    return { success: true, processed: results.length, results };

  } catch (error: any) {
    console.error('Error processing integrations:', error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'sync_all';

    console.log(`Processing integration action: ${action}`);

    let result;

    switch (action) {
      case 'sync':
        // Sincronizar integração específica
        const integrationRequest: IntegrationRequest = await req.json();
        result = await syncIntegration(
          integrationRequest.integration_id, 
          integrationRequest.action, 
          integrationRequest.data
        );
        break;

      case 'sync_all':
        // Sincronizar todas as integrações
        result = await processAllIntegrations();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: result.success,
      ...result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in external-integrations function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);