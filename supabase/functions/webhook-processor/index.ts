import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5";
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WebhookPayload {
  webhook_config_id: string;
  event_type: string;
  payload: any;
  attempt_number: number;
}

async function processWebhook(webhookLog: any) {
  try {
    // Buscar configuração do webhook
    const { data: webhookConfig, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('id', webhookLog.webhook_config_id)
      .single();

    if (error || !webhookConfig) {
      throw new Error('Webhook config not found');
    }

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Lovable-Webhook/1.0',
      ...webhookConfig.headers
    };

    // Adicionar assinatura HMAC se secret_key estiver configurado
    if (webhookConfig.secret_key) {
      const signature = createHmac('sha256', webhookConfig.secret_key)
        .update(JSON.stringify(webhookLog.payload))
        .digest('hex');
      headers['X-Webhook-Signature'] = `sha256=${signature}`;
    }

    // Fazer a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), webhookConfig.timeout_seconds * 1000);

    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(webhookLog.payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseBody = await response.text();

    // Atualizar log com resultado
    await supabase
      .from('webhook_logs')
      .update({
        response_status: response.status,
        response_body: responseBody.substring(0, 1000), // Limitar tamanho
        success: response.ok,
        sent_at: new Date().toISOString(),
        error_message: response.ok ? null : `HTTP ${response.status}: ${responseBody}`
      })
      .eq('id', webhookLog.id);

    console.log(`Webhook sent successfully: ${webhookConfig.name} - ${response.status}`);
    return { success: true, status: response.status };

  } catch (error: any) {
    console.error('Error sending webhook:', error);

    // Atualizar log com erro
    await supabase
      .from('webhook_logs')
      .update({
        success: false,
        error_message: error.message,
        sent_at: new Date().toISOString()
      })
      .eq('id', webhookLog.id);

    // Tentar novamente se não excedeu o limite
    if (webhookLog.attempt_number < 3) {
      await supabase
        .from('webhook_logs')
        .insert({
          webhook_config_id: webhookLog.webhook_config_id,
          event_type: webhookLog.event_type,
          payload: webhookLog.payload,
          attempt_number: webhookLog.attempt_number + 1
        });
    }

    return { success: false, error: error.message };
  }
}

async function processPendingWebhooks() {
  try {
    // Buscar webhooks pendentes (sem sent_at)
    const { data: pendingLogs, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .is('sent_at', null)
      .limit(10);

    if (error) throw error;

    console.log(`Processing ${pendingLogs?.length || 0} pending webhooks`);

    const results = [];
    for (const log of pendingLogs || []) {
      const result = await processWebhook(log);
      results.push({ log_id: log.id, ...result });
    }

    return { success: true, processed: results.length, results };

  } catch (error: any) {
    console.error('Error processing webhooks:', error);
    return { success: false, error: error.message };
  }
}

async function triggerWebhook(payload: WebhookPayload) {
  try {
    const result = await processWebhook({
      id: crypto.randomUUID(),
      webhook_config_id: payload.webhook_config_id,
      event_type: payload.event_type,
      payload: payload.payload,
      attempt_number: payload.attempt_number || 1
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'process';

    console.log(`Processing webhook action: ${action}`);

    let result;

    switch (action) {
      case 'process':
        // Processar webhooks pendentes
        result = await processPendingWebhooks();
        break;

      case 'trigger':
        // Disparar webhook específico
        const webhookPayload: WebhookPayload = await req.json();
        result = await triggerWebhook(webhookPayload);
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
    console.error('Error in webhook-processor function:', error);
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