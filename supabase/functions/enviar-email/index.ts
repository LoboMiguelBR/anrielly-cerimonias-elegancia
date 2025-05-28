
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to?: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  subject?: string;
  contractUrl?: string;
  eventType?: string;
  contractData?: any;
  auditData?: {
    signerIp?: string;
    userAgent?: string;
    contractHash?: string;
    signedAt?: string;
  };
  tipo: string;
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method}`)
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    console.log('Environment check:', {
      supabaseUrl: supabaseUrl ? '✓ Set' : '✗ Missing',
      supabaseServiceKey: supabaseServiceKey ? '✓ Set' : '✗ Missing',
      resendApiKey: resendApiKey ? '✓ Set' : '✗ Missing'
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    if (!resendApiKey) {
      throw new Error('Resend API key not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)

    const requestData: EmailRequest = await req.json()
    console.log('Request data:', { ...requestData, contractData: requestData.contractData ? 'present' : 'missing' })

    const { to, name, email, phone, message, subject, contractUrl, eventType, contractData, auditData, tipo } = requestData

    let emailSubject = subject || 'Notificação'
    let emailHtml = ''
    let emailTo = to || email || ''

    // Processar diferentes tipos de email
    switch (tipo) {
      case 'contrato-assinatura':
        emailSubject = subject || `Contrato para Assinatura Digital - ${eventType || 'Evento'}`
        emailHtml = `
          <h2>Olá ${name},</h2>
          
          <p>Segue o link para assinatura digital do seu contrato de prestação de serviços de cerimonial:</p>
          
          <p><strong><a href="${contractUrl}" target="_blank" style="color: #2754C5; text-decoration: underline;">Clique aqui para assinar o contrato</a></strong></p>
          
          <h3>✅ SOBRE A ASSINATURA DIGITAL:</h3>
          <ul>
            <li>Possui validade jurídica conforme Lei nº 14.063/2020</li>
            <li>Registra automaticamente data, hora e IP para auditoria</li>
            <li>Você receberá o PDF assinado por email após a conclusão</li>
          </ul>
          
          <h3>📋 PARA ASSINAR:</h3>
          <ol>
            <li>Clique no link acima</li>
            <li>Leia o contrato completo</li>
            <li>Preencha seus dados pessoais</li>
            <li>Desenhe sua assinatura no campo indicado (obrigatório)</li>
            <li>Clique em "Assinar Contrato Digitalmente"</li>
          </ol>
          
          <p><strong>⚠️ IMPORTANTE:</strong> A assinatura desenhada é obrigatória para garantir a validade jurídica do documento.</p>
          
          <p>Caso tenha alguma dúvida, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br>
          <strong>Anrielly Gomes - Mestre de Cerimônia</strong><br>
          📱 (24) 99268-9947<br>
          📧 contato@anriellygomes.com.br</p>
        `
        break

      case 'contrato-assinado':
        emailSubject = subject || 'Confirmação: Contrato Assinado com Sucesso'
        emailHtml = `
          <h2>Olá ${name},</h2>
          
          <p>✅ <strong>Seu contrato foi assinado com sucesso!</strong></p>
          
          <h3>📋 Detalhes da Assinatura:</h3>
          <ul>
            <li><strong>Data/Hora:</strong> ${auditData?.signedAt || new Date().toLocaleString('pt-BR')}</li>
            ${auditData?.signerIp ? `<li><strong>IP:</strong> ${auditData.signerIp}</li>` : ''}
            ${auditData?.contractHash ? `<li><strong>Hash do Documento:</strong> ${auditData.contractHash}</li>` : ''}
          </ul>
          
          <p>O contrato assinado digitalmente possui validade jurídica conforme Lei nº 14.063/2020.</p>
          
          <p>Em breve entraremos em contato para os próximos passos do seu evento.</p>
          
          <p>Atenciosamente,<br>
          <strong>Anrielly Gomes - Mestre de Cerimônia</strong><br>
          📱 (24) 99268-9947<br>
          📧 contato@anriellygomes.com.br</p>
        `
        break

      case 'contato':
        emailSubject = 'Nova mensagem de contato pelo site'
        emailHtml = `
          <h2>Nova mensagem de contato</h2>
          
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          
          <h3>Mensagem:</h3>
          <p>${message}</p>
        `
        emailTo = 'contato@anriellygomes.com.br'
        break

      case 'novo-depoimento':
        emailSubject = 'Novo depoimento submetido'
        emailHtml = `
          <h2>Novo depoimento submetido</h2>
          
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <p>Um novo depoimento foi submetido e aguarda aprovação no painel administrativo.</p>
        `
        emailTo = 'contato@anriellygomes.com.br'
        break

      case 'depoimento-aprovado':
        emailSubject = 'Seu depoimento foi aprovado!'
        emailHtml = `
          <h2>Olá ${name},</h2>
          
          <p>Seu depoimento foi aprovado e já está visível no nosso site!</p>
          
          <p>Obrigada por compartilhar sua experiência conosco.</p>
          
          <p>Atenciosamente,<br>
          <strong>Anrielly Gomes - Mestre de Cerimônia</strong><br>
          📱 (24) 99268-9947<br>
          📧 contato@anriellygomes.com.br</p>
        `
        break

      default:
        emailSubject = subject || message || 'Notificação'
        emailHtml = `
          <h2>Olá ${name},</h2>
          <p>${message || 'Nova notificação do sistema.'}</p>
          
          <p>Atenciosamente,<br>
          <strong>Anrielly Gomes - Mestre de Cerimônia</strong><br>
          📱 (24) 99268-9947<br>
          📧 contato@anriellygomes.com.br</p>
        `
    }

    // Enviar email principal
    console.log('Sending email to:', emailTo)
    const emailResult = await resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    })

    console.log('Email sent successfully:', emailResult)

    // Para contratos, sempre enviar cópia para contato@anriellygomes.com.br
    if (tipo === 'contrato-assinatura' || tipo === 'contrato-assinado') {
      if (emailTo !== 'contato@anriellygomes.com.br') {
        console.log('Sending copy to admin...')
        
        const adminSubject = `[CÓPIA] ${emailSubject}`
        const adminHtml = `
          <p><strong>CÓPIA DO EMAIL ENVIADO PARA O CLIENTE:</strong></p>
          <hr>
          <p><strong>Para:</strong> ${emailTo}</p>
          <p><strong>Assunto:</strong> ${emailSubject}</p>
          <hr>
          ${emailHtml}
        `
        
        await resend.emails.send({
          from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
          to: ['contato@anriellygomes.com.br'],
          subject: adminSubject,
          html: adminHtml,
        })
        
        console.log('Admin copy sent successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso!',
        emailId: emailResult.data?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in enviar-email function:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
