
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractSignedRequest {
  contractId: string;
  signatureData: any;
  clientIP: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { contractId, signatureData, clientIP }: ContractSignedRequest = await req.json();

    console.log('Processing contract signing:', contractId);

    // Fetch contract data
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      throw new Error('Contract not found');
    }

    // Generate PDF content
    const pdfContent = generateContractPDF(contract, signatureData);
    
    // Update contract with signature data
    const { error: updateError } = await supabase
      .from('contracts')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signer_ip: clientIP,
        signature_data: signatureData,
        pdf_url: `contract-${contractId}-signed.pdf` // This would be actual storage URL
      })
      .eq('id', contractId);

    if (updateError) {
      throw new Error('Failed to update contract');
    }

    // Send emails
    await sendContractEmails(resend, contract, signatureData);

    console.log('Contract signed and processed successfully:', contractId);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error processing contract signing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateContractPDF(contract: any, signatureData: any): string {
  // This is a simplified PDF generation
  // In production, you'd use a proper PDF library like jsPDF or Puppeteer
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Contrato - ${contract.client_name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { text-align: center; color: #333; }
        h2 { color: #666; margin-top: 30px; }
        .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 300px; text-align: center; }
        .signature-line { border-bottom: 1px solid #000; margin-bottom: 10px; height: 80px; }
        .signature-image { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CERIMONIAL</h1>
      
      <p><strong>CONTRATADA:</strong> Anrielly Cristina Costa Gomes, Mestre de Cerimônia, CPF: 092.005.807-85, residente na Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ, Telefone: (24) 99268-9947, E-mail: contato@anriellygomes.com.br</p>
      
      <p><strong>CONTRATANTE:</strong> ${contract.client_name}, ${contract.civil_status || ''}, ${contract.client_profession || ''}, residente em ${contract.client_address || ''}, telefone ${contract.client_phone}, e-mail ${contract.client_email}.</p>
      
      <h2>CLÁUSULA PRIMEIRA – DO OBJETO</h2>
      <p>O presente contrato tem como objeto a prestação de serviços profissionais de cerimonial para o evento a ser realizado no dia ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '___/___/___'}, às ${contract.event_time || '__:__'}, no endereço ${contract.event_location || ''}.</p>
      
      <h2>CLÁUSULA SEGUNDA – DO PREÇO E CONDIÇÕES DE PAGAMENTO</h2>
      <p>O valor total dos serviços contratados é de R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago da seguinte forma:</p>
      <p>a) Entrada: R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser paga em ${contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '___/___/___'};</p>
      <p>b) Saldo: R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser pago em ${contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '___/___/___'}.</p>
      
      <h2>CLÁUSULA DÉCIMA – DISPOSIÇÕES FINAIS</h2>
      <p>E por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.</p>
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">
            ${signatureData.signature ? `<img src="${signatureData.signature}" class="signature-image" alt="Assinatura do Cliente" />` : ''}
          </div>
          <p><strong>${contract.client_name}</strong><br/>Contratante</p>
          <p><small>Assinado digitalmente em ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}</small></p>
        </div>
        
        <div class="signature-box">
          <div class="signature-line">
            <!-- Aqui seria incluída a assinatura da Anrielly -->
          </div>
          <p><strong>Anrielly Cristina Costa Gomes</strong><br/>Contratada</p>
        </div>
      </div>
      
      <p style="margin-top: 50px; font-size: 12px; color: #666;">
        Documento assinado digitalmente em ${new Date().toLocaleString('pt-BR')} - IP: ${signatureData.signer_ip || 'N/A'}
      </p>
    </body>
    </html>
  `;
}

async function sendContractEmails(resend: any, contract: any, signatureData: any): Promise<void> {
  try {
    // Email para o cliente
    await resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [contract.client_email],
      subject: 'Contrato Assinado - Anrielly Gomes Cerimonial',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contrato Assinado com Sucesso!</h2>
          
          <p>Olá, ${contract.client_name}!</p>
          
          <p>Seu contrato foi assinado com sucesso em ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalhes do Evento:</h3>
            <p><strong>Tipo:</strong> ${contract.event_type}</p>
            <p><strong>Data:</strong> ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'A definir'}</p>
            <p><strong>Local:</strong> ${contract.event_location}</p>
            <p><strong>Valor Total:</strong> R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <p>Uma cópia do contrato assinado foi anexada a este email. Guarde-a para seus registros.</p>
          
          <p>Caso tenha alguma dúvida, entre em contato conosco pelo telefone (24) 99268-9947 ou email contato@anriellygomes.com.br.</p>
          
          <p>Muito obrigada pela confiança!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              <strong>Anrielly Gomes - Mestre de Cerimônia</strong><br/>
              Telefone: (24) 99268-9947<br/>
              Email: contato@anriellygomes.com.br<br/>
              Website: www.anriellygomes.com.br
            </p>
          </div>
        </div>
      `,
    });

    // Email para Anrielly (cópia de controle)
    await resend.emails.send({
      from: 'Sistema <contato@anriellygomes.com.br>',
      to: ['contato@anriellygomes.com.br'],
      subject: `[NOVO CONTRATO] ${contract.client_name} - ${contract.event_type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Novo Contrato Assinado!</h2>
          
          <p>Um novo contrato foi assinado no sistema:</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Informações do Cliente:</h3>
            <p><strong>Nome:</strong> ${contract.client_name}</p>
            <p><strong>Email:</strong> ${contract.client_email}</p>
            <p><strong>Telefone:</strong> ${contract.client_phone}</p>
            <p><strong>Endereço:</strong> ${contract.client_address}</p>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalhes do Evento:</h3>
            <p><strong>Tipo:</strong> ${contract.event_type}</p>
            <p><strong>Data:</strong> ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'A definir'}</p>
            <p><strong>Horário:</strong> ${contract.event_time || 'A definir'}</p>
            <p><strong>Local:</strong> ${contract.event_location}</p>
          </div>
          
          <div style="background: #f0fff0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Informações Financeiras:</h3>
            <p><strong>Valor Total:</strong> R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Entrada:</strong> R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</p>
            <p><strong>Saldo:</strong> R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</p>
          </div>
          
          <p><strong>Assinado em:</strong> ${new Date(signatureData.timestamp).toLocaleString('pt-BR')}</p>
          
          <p>Acesse o painel administrativo para mais detalhes.</p>
        </div>
      `,
    });

    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}
