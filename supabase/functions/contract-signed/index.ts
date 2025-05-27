
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

    // Enviar email para o cliente
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Contrato Assinado com Sucesso!</h2>
        
        <p>Olá <strong>${contract.client_name}</strong>,</p>
        
        <p>Seu contrato de <strong>${contract.event_type}</strong> foi assinado digitalmente com sucesso!</p>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">✅ Detalhes da Assinatura:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Data/Hora:</strong> ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}</li>
            <li><strong>Evento:</strong> ${contract.event_type}</li>
            <li><strong>Data do Evento:</strong> ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'A definir'}</li>
            <li><strong>Local:</strong> ${contract.event_location}</li>
            <li><strong>Valor Total:</strong> R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">📋 Validade Jurídica:</h3>
          <p style="margin: 5px 0;">Este contrato possui validade jurídica conforme:</p>
          <ul style="margin: 10px 0;">
            <li>Lei nº 14.063/2020 (Marco Legal das Assinaturas Eletrônicas)</li>
            <li>Lei nº 12.965/2014 (Marco Civil da Internet)</li>
            <li>Código Civil Brasileiro</li>
          </ul>
          <p style="margin: 5px 0; font-size: 14px; color: #92400e;">
            <strong>Hash do documento:</strong> ${signatureData.contract_hash.substring(0, 32)}...
          </p>
        </div>
        
        <p>Em caso de dúvidas, entre em contato conosco:</p>
        <p style="margin: 5px 0;"><strong>Anrielly Gomes - Mestre de Cerimônia</strong></p>
        <p style="margin: 5px 0;">📞 (24) 99268-9947</p>
        <p style="margin: 5px 0;">✉️ contato@anriellygomes.com.br</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Este é um email automático. Não responda a esta mensagem.
        </p>
      </div>
    `

    await resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [contract.client_email],
      subject: `Contrato Assinado - ${contract.event_type}`,
      html: clientEmailContent,
    })

    // Enviar email para Anrielly (cópia de controle)
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
          <h3 style="color: #166534; margin-top: 0;">Dados da Assinatura:</h3>
          <ul style="margin: 10px 0;">
            <li><strong>Data/Hora:</strong> ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}</li>
            <li><strong>IP:</strong> ${clientIP}</li>
            <li><strong>Navegador:</strong> ${signatureData.user_agent}</li>
            <li><strong>Hash:</strong> ${signatureData.contract_hash.substring(0, 48)}...</li>
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

    console.log('Emails sent successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Contract signed and emails sent' }),
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
