
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  template?: 'welcome' | 'contract' | 'proposal' | 'notification';
  data?: Record<string, any>;
}

const getEmailTemplate = (template: string, data: Record<string, any>) => {
  switch (template) {
    case 'welcome':
      return {
        subject: `Bem-vindo(a), ${data.name}!`,
        html: `
          <h1>Olá ${data.name}!</h1>
          <p>Seja bem-vindo(a) à nossa plataforma.</p>
          <p>Estamos muito felizes em tê-lo(a) conosco!</p>
        `
      };
    case 'contract':
      return {
        subject: 'Contrato disponível para assinatura',
        html: `
          <h2>Contrato pronto para assinatura</h2>
          <p>Olá ${data.clientName},</p>
          <p>Seu contrato está pronto para assinatura.</p>
          <a href="${data.contractUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Assinar Contrato
          </a>
        `
      };
    case 'proposal':
      return {
        subject: 'Nova proposta disponível',
        html: `
          <h2>Proposta comercial</h2>
          <p>Olá ${data.clientName},</p>
          <p>Sua proposta está pronta para visualização.</p>
          <a href="${data.proposalUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Ver Proposta
          </a>
        `
      };
    default:
      return {
        subject: data.subject || 'Notificação',
        html: data.html || '<p>Você recebeu uma nova notificação.</p>'
      };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();
    console.log('Enviando email:', emailData);

    let emailContent = {
      subject: emailData.subject,
      html: emailData.html || emailData.text
    };

    // Se especificou template, usar template
    if (emailData.template && emailData.data) {
      emailContent = getEmailTemplate(emailData.template, emailData.data);
    }

    const result = await resend.emails.send({
      from: emailData.from || "Anrielly Gomes <contato@anriellygomes.com.br>",
      to: [emailData.to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email enviado com sucesso:', result);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
