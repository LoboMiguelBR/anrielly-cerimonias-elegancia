import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração do Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Templates de email
const emailTemplates = {
  welcome_lead: {
    subject: "Obrigado pelo seu interesse em nossos serviços!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Obrigado pelo seu interesse!</h1>
        <p>Olá <strong>{{name}}</strong>,</p>
        <p>Recebemos sua solicitação para seu evento <strong>{{event_type}}</strong> e nossa equipe já está trabalhando para criar uma proposta personalizada para você.</p>
        <p>Em breve entraremos em contato para entender melhor suas necessidades e expectativas.</p>
        <p>Estamos ansiosos para fazer parte do seu dia especial!</p>
        <br>
        <p>Com carinho,<br>Equipe Anrielly Gomes</p>
      </div>
    `
  },
  followup_proposal: {
    subject: "Sua proposta personalizada está sendo preparada",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Sua proposta está quase pronta!</h1>
        <p>Olá <strong>{{name}}</strong>,</p>
        <p>Nossa equipe está finalizando uma proposta especial para seu evento <strong>{{event_type}}</strong>.</p>
        <p>Em breve você receberá todos os detalhes e valores. Enquanto isso, que tal dar uma olhada em nosso portfólio?</p>
        <p>Estamos empolgados para trabalhar com você!</p>
        <br>
        <p>Com carinho,<br>Equipe Anrielly Gomes</p>
      </div>
    `
  },
  proposal_followup: {
    subject: "Já teve tempo de analisar nossa proposta?",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Esperamos que tenha gostado da nossa proposta!</h1>
        <p>Olá <strong>{{name}}</strong>,</p>
        <p>Enviamos nossa proposta para seu evento <strong>{{event_type}}</strong> há alguns dias.</p>
        <p>Gostaríamos de saber se há alguma dúvida ou se você precisa de esclarecimentos adicionais.</p>
        <p>Nossa equipe está à disposição para ajustar a proposta conforme suas necessidades.</p>
        <p>Aguardamos seu retorno!</p>
        <br>
        <p>Com carinho,<br>Equipe Anrielly Gomes</p>
      </div>
    `
  },
  contract_welcome: {
    subject: "Bem-vindo! Próximos passos do seu evento",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Bem-vindo à família Anrielly Gomes!</h1>
        <p>Olá <strong>{{name}}</strong>,</p>
        <p>🎉 Parabéns! Seu contrato foi assinado com sucesso!</p>
        <p>Estamos muito felizes em fazer parte do seu evento <strong>{{event_type}}</strong>.</p>
        <p>Nos próximos dias, nossa equipe entrará em contato para alinhar todos os detalhes e cronograma.</p>
        <p>Vamos juntos criar um evento inesquecível!</p>
        <br>
        <p>Com muito carinho,<br>Equipe Anrielly Gomes</p>
      </div>
    `
  },
  event_week_reminder: {
    subject: "Seu evento se aproxima - Checklist final",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Seu grande dia está chegando!</h1>
        <p>Olá <strong>{{name}}</strong>,</p>
        <p>Falta apenas uma semana para seu evento <strong>{{event_type}}</strong>!</p>
        <p>Nossa equipe está finalizando todos os preparativos para garantir que tudo seja perfeito.</p>
        <p>Em breve entraremos em contato para confirmar os últimos detalhes.</p>
        <p>Estamos ansiosos para celebrar com você!</p>
        <br>
        <p>Com muito carinho,<br>Equipe Anrielly Gomes</p>
      </div>
    `
  }
};

function replaceTemplateVariables(template: string, data: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
}

async function processEmailFollowup(followup: any) {
  if (!resend) {
    console.log('Resend API key not configured, skipping email followup');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    // Buscar dados do registro baseado na tabela
    let recordData: any = null;
    
    if (followup.record_table === 'quote_requests') {
      const { data } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', followup.record_id)
        .single();
      recordData = data;
    } else if (followup.record_table === 'proposals') {
      const { data } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', followup.record_id)
        .single();
      recordData = data;
    } else if (followup.record_table === 'contracts') {
      const { data } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', followup.record_id)
        .single();
      recordData = data;
    } else if (followup.record_table === 'events') {
      const { data } = await supabase
        .from('events')
        .select('*, clientes(*)')
        .eq('id', followup.record_id)
        .single();
      recordData = data;
    }

    if (!recordData) {
      throw new Error('Record not found');
    }

    // Determinar dados do destinatário
    const recipientEmail = recordData.email || recordData.client_email;
    const recipientName = recordData.name || recordData.client_name;
    
    if (!recipientEmail) {
      throw new Error('No recipient email found');
    }

    // Buscar template
    const templateName = followup.template_data?.template || 'welcome_lead';
    const template = emailTemplates[templateName as keyof typeof emailTemplates];
    
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Preparar dados para substituição
    const templateData = {
      name: recipientName,
      event_type: recordData.event_type,
      event_date: recordData.event_date,
      event_location: recordData.event_location || recordData.location,
      ...followup.template_data
    };

    // Processar template
    const subject = replaceTemplateVariables(
      followup.template_data?.subject || template.subject, 
      templateData
    );
    const html = replaceTemplateVariables(template.html, templateData);

    // Enviar email
    const emailResult = await resend.emails.send({
      from: 'Anrielly Gomes <noreply@anriellygomes.com>',
      to: [recipientEmail],
      subject: subject,
      html: html,
    });

    console.log('Email sent successfully:', emailResult);
    return { success: true, data: emailResult };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting followup processing...');

    // Buscar follow-ups pendentes que estão na hora de serem enviados
    const { data: pendingFollowups, error: fetchError } = await supabase
      .from('scheduled_followups')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for', { ascending: true })
      .limit(50); // Processar até 50 por execução

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${pendingFollowups?.length || 0} pending followups`);

    const results = [];

    for (const followup of pendingFollowups || []) {
      console.log(`Processing followup ${followup.id} of type ${followup.followup_type}`);

      let result = { success: false, error: 'Unknown followup type' };

      try {
        if (followup.followup_type === 'email') {
          result = await processEmailFollowup(followup);
        }
        // Adicionar outros tipos de follow-up aqui (SMS, notificação push, etc.)

        // Atualizar status do follow-up
        if (result.success) {
          await supabase
            .from('scheduled_followups')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              error_message: null
            })
            .eq('id', followup.id);
        } else {
          const newRetryCount = followup.retry_count + 1;
          const shouldRetry = newRetryCount < followup.max_retries;

          await supabase
            .from('scheduled_followups')
            .update({
              status: shouldRetry ? 'pending' : 'failed',
              retry_count: newRetryCount,
              error_message: result.error,
              scheduled_for: shouldRetry 
                ? new Date(Date.now() + 60000 * Math.pow(2, newRetryCount)).toISOString() // Exponential backoff
                : followup.scheduled_for
            })
            .eq('id', followup.id);
        }

      } catch (error) {
        console.error(`Error processing followup ${followup.id}:`, error);
        result = { success: false, error: error.message };
      }

      results.push({
        followup_id: followup.id,
        type: followup.followup_type,
        success: result.success,
        error: result.error
      });
    }

    console.log('Followup processing completed');

    return new Response(JSON.stringify({
      processed: results.length,
      results: results,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in process-followups function:', error);
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