
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendProposalRequest {
  proposalId: string;
  to: string;
  subject?: string;
  message?: string;
  pdfUrl: string;
  clientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { proposalId, to, subject, message, pdfUrl, clientName }: SendProposalRequest = await req.json();

    if (!proposalId || !to || !pdfUrl) {
      throw new Error("Missing required fields: proposalId, to, or pdfUrl");
    }

    // Send email with the proposal
    const emailResponse = await resend.emails.send({
      from: "Anrielly Gomes <noreply@anriellygomes.com.br>",
      to: [to],
      subject: subject || "Proposta de Serviço - Anrielly Gomes",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8A2BE2; border-bottom: 2px solid #F2AE30; padding-bottom: 10px;">
            Proposta de Serviço - Anrielly Gomes
          </h2>
          
          <p>Olá ${clientName},</p>
          
          ${message ? `<p>${message}</p>` : `
          <p>
            É com grande satisfação que envio a proposta de serviços fotográficos conforme solicitado.
          </p>
          <p>
            Você pode visualizar todos os detalhes no arquivo PDF anexo a este email.
          </p>`}
          
          <p>
            Para qualquer dúvida ou esclarecimento, não hesite em entrar em contato.
          </p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8A2BE2;">
            <p style="margin-bottom: 0; font-style: italic;">
              "Capturando momentos especiais com arte e sensibilidade."
            </p>
          </div>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
            <p>Anrielly Gomes - Fotografia Profissional</p>
            <p>Website: <a href="https://www.anriellygomes.com.br" style="color: #8A2BE2;">www.anriellygomes.com.br</a></p>
            <p>Instagram: <a href="https://www.instagram.com/anriellyfotografia" style="color: #8A2BE2;">@anriellyfotografia</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `proposta_${proposalId}.pdf`,
          path: pdfUrl,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    // Update the proposal status in the database
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { error: updateError } = await supabase
      .from("proposals")
      .update({ status: "sent" })
      .eq("id", proposalId);

    if (updateError) {
      console.error("Error updating proposal status:", updateError);
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending proposal:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Error sending proposal" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
