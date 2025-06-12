
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface PaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  clientEmail: string;
  clientName: string;
  contractId?: string;
  proposalId?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paymentData: PaymentRequest = await req.json();
    console.log('Processando pagamento:', paymentData);

    // Verificar se cliente já existe no Stripe
    const customers = await stripe.customers.list({
      email: paymentData.clientEmail,
      limit: 1
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Criar novo cliente
      const customer = await stripe.customers.create({
        email: paymentData.clientEmail,
        name: paymentData.clientName,
      });
      customerId = customer.id;
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: paymentData.currency || 'brl',
            product_data: {
              name: paymentData.description || 'Serviço de Cerimonial',
            },
            unit_amount: paymentData.amount * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        contractId: paymentData.contractId || '',
        proposalId: paymentData.proposalId || '',
        ...paymentData.metadata
      }
    });

    // Registrar transação no banco
    if (paymentData.contractId || paymentData.proposalId) {
      await supabase.from('financial_transactions').insert({
        type: 'payment',
        amount: paymentData.amount,
        currency: paymentData.currency || 'BRL',
        description: paymentData.description,
        status: 'pending',
        stripe_session_id: session.id,
        contract_id: paymentData.contractId,
        proposal_id: paymentData.proposalId,
        metadata: paymentData.metadata
      });
    }

    console.log('Sessão de pagamento criada:', session.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: session.id,
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro ao processar pagamento:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
