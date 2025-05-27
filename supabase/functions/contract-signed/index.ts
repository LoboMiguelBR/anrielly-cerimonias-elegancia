
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContractSignedRequest {
  contractId: string
  signatureData: {
    agreed: boolean
    signature: string
    timestamp: string
    client_name: string
    ip_address: string
    user_agent: string
    contract_hash: string
    legal_compliance: {
      lei_14063_2020: boolean
      marco_civil_internet: boolean
      codigo_civil_brasileiro: boolean
    }
  }
  clientIP: string
}

// Função para substituir variáveis em templates de email
const replaceEmailVariables = (template: string, contract: any, additionalData: any) => {
  const signedDate = new Date(additionalData.timestamp || new Date());
  
  const variables = {
    '{{NOME_CLIENTE}}': contract.client_name || '',
    '{{EMAIL_CLIENTE}}': contract.client_email || '',
    '{{TELEFONE_CLIENTE}}': contract.client_phone || '',
    '{{ENDERECO_CLIENTE}}': contract.client_address || '',
    '{{PROFISSAO_CLIENTE}}': contract.client_profession || '',
    '{{ESTADO_CIVIL}}': contract.civil_status || '',
    '{{TIPO_EVENTO}}': contract.event_type || '',
    '{{DATA_EVENTO}}': contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '',
    '{{HORARIO_EVENTO}}': contract.event_time || '',
    '{{LOCAL_EVENTO}}': contract.event_location || '',
    '{{VALOR_TOTAL}}': contract.total_price ? `R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{ENTRADA}}': contract.down_payment ? `R$ ${contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{DATA_ENTRADA}}': contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '',
    '{{VALOR_RESTANTE}}': contract.remaining_amount ? `R$ ${contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{DATA_PAGAMENTO_RESTANTE}}': contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '',
    '{{LINK_CONTRATO}}': additionalData.contractUrl || '',
    
    // NOVAS VARIÁVEIS DE AUDITORIA
    '{{IP_ASSINANTE}}': additionalData.clientIP || '',
    '{{USER_AGENT}}': additionalData.user_agent || '',
    '{{HASH_CONTRATO}}': additionalData.contract_hash || '',
    '{{DATA_ASSINATURA}}': signedDate.toLocaleDateString('pt-BR'),
    '{{HORA_ASSINATURA}}': signedDate.toLocaleTimeString('pt-BR'),
    
    '{{NOME_EMPRESA}}': 'Anrielly Gomes - Mestre de Cerimônia',
    '{{TELEFONE_EMPRESA}}': '(24) 99268-9947',
    '{{EMAIL_EMPRESA}}': 'contato@anriellygomes.com.br',
    '{{OBSERVACOES}}': contract.notes || ''
  };

  let result = template;
  Object.entries(variables).forEach(([variable, value]) => {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return result;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { contractId, signatureData, clientIP }: ContractSignedRequest = await req.json()

    console.log('Processing contract signature:', { contractId, clientIP })

    // Atualizar contrato no banco de dados
    const { data: contract, error: updateError } = await supabaseClient
      .from('contracts')
      .update({
        status: 'signed',
        signed_at: signatureData.timestamp,
        signer_ip: clientIP,
        signature_data: signatureData
      })
      .eq('id', contractId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating contract:', updateError)
      throw updateError
    }

    console.log('Contract updated successfully:', contract.id)

    // Buscar template de email de confirmação de assinatura
    const { data: emailTemplate } = await supabaseClient
      .from('contract_email_templates')
      .select('*')
      .eq('template_type', 'signed_confirmation')
      .eq('is_default', true)
      .maybeSingle()

    // Template padrão caso não tenha no banco
    const defaultClientTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Contrato Assinado com Sucesso! ✅</h2>
        
        <p>Olá <strong>{{NOME_CLIENTE}}</strong>,</p>
        
        <p>Seu contrato de <strong>{{TIPO_EVENTO}}</strong> foi assinado digitalmente com sucesso!</p>
        
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">✅ Detalhes da Assinatura:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Data/Hora:</strong> {{DATA_ASSINATURA}} às {{HORA_ASSINATURA}}</li>
            <li><strong>Evento:</strong> {{TIPO_EVENTO}}</li>
            <li><strong>Data do Evento:</strong> {{DATA_EVENTO}}</li>
            <li><strong>Local:</strong> {{LOCAL_EVENTO}}</li>
            <li><strong>Valor Total:</strong> {{VALOR_TOTAL}}</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">🔒 Dados de Auditoria e Segurança:</h3>
          <ul style="font-size: 12px; margin: 10px 0;">
            <li><strong>IP do Assinante:</strong> {{IP_ASSINANTE}}</li>
            <li><strong>Dispositivo/Navegador:</strong> {{USER_AGENT}}</li>
            <li><strong>Hash do Documento:</strong> {{HASH_CONTRATO}}</li>
          </ul>
          <p style="margin: 5px 0; font-size: 14px; color: #92400e;">
            <strong>📋 Validade Jurídica:</strong> Este contrato possui validade jurídica conforme Lei nº 14.063/2020, Marco Civil da Internet e Código Civil Brasileiro.
          </p>
        </div>
        
        <p>Em caso de dúvidas, entre em contato conosco:</p>
        <p style="margin: 5px 0;"><strong>{{NOME_EMPRESA}}</strong></p>
        <p style="margin: 5px 0;">📞 {{TELEFONE_EMPRESA}}</p>
        <p style="margin: 5px 0;">✉️ {{EMAIL_EMPRESA}}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Este é um email automático. Não responda a esta mensagem.
        </p>
      </div>
    `;

    // Usar template do banco ou padrão
    const clientEmailTemplate = emailTemplate?.html_content || defaultClientTemplate;
    const clientSubject = emailTemplate?.subject || `Contrato Assinado - {{TIPO_EVENTO}}`;

    // Substituir variáveis no template do cliente
    const clientEmailContent = replaceEmailVariables(clientEmailTemplate, contract, {
      clientIP,
      user_agent: signatureData.user_agent,
      contract_hash: signatureData.contract_hash,
      timestamp: signatureData.timestamp
    });

    const finalClientSubject = replaceEmailVariables(clientSubject, contract, {
      clientIP,
      user_agent: signatureData.user_agent,
      contract_hash: signatureData.contract_hash,
      timestamp: signatureData.timestamp
    });

    await resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [contract.client_email],
      subject: finalClientSubject,
      html: clientEmailContent,
    })

    // Email para Anrielly (cópia de controle com dados de auditoria)
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🎉 Novo Contrato Assinado!</h2>
        
        <p>Um novo contrato foi assinado digitalmente:</p>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Dados do Cliente:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Nome:</strong> ${contract.client_name}</li>
            <li><strong>Email:</strong> ${contract.client_email}</li>
            <li><strong>Telefone:</strong> ${contract.client_phone}</li>
            <li><strong>Evento:</strong> ${contract.event_type}</li>
            <li><strong>Data do Evento:</strong> ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'A definir'}</li>
            <li><strong>Local:</strong> ${contract.event_location}</li>
            <li><strong>Valor:</strong> R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">🔒 Dados de Auditoria Completos:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Data/Hora:</strong> ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}</li>
            <li><strong>IP do Assinante:</strong> ${clientIP}</li>
            <li><strong>User Agent:</strong> ${signatureData.user_agent}</li>
            <li><strong>Hash do Contrato:</strong> ${signatureData.contract_hash}</li>
            <li><strong>Conformidade Legal:</strong></li>
            <ul style="margin-left: 20px;">
              <li>Lei 14.063/2020: ${signatureData.legal_compliance?.lei_14063_2020 ? '✅' : '❌'}</li>
              <li>Marco Civil: ${signatureData.legal_compliance?.marco_civil_internet ? '✅' : '❌'}</li>
              <li>Código Civil: ${signatureData.legal_compliance?.codigo_civil_brasileiro ? '✅' : '❌'}</li>
            </ul>
          </ul>
        </div>
        
        <p>Acesse o painel administrativo para mais detalhes.</p>
      </div>
    `

    await resend.emails.send({
      from: 'Sistema de Contratos <contato@anriellygomes.com.br>',
      to: ['contato@anriellygomes.com.br'],
      subject: `Novo Contrato Assinado - ${contract.client_name}`,
      html: adminEmailContent,
    })

    console.log('Emails sent successfully with audit data')

    return new Response(
      JSON.stringify({ success: true, message: 'Contract signed and emails sent with audit data' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing contract signature:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  }
})
