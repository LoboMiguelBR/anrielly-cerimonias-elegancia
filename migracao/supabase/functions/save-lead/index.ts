
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const body = await req.json();
    
    console.log('Received lead data:', body);

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Campos obrigatórios: name, email, phone'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert lead into quote_requests table (corrigido de 'leads' para 'quote_requests')
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          event_type: body.event_type || 'Não especificado',
          event_date: body.event_date || null,
          event_location: body.event_location || '',
          message: body.message || '',
          status: 'aguardando'
        }
      ]);

    if (error) {
      console.error('Erro ao inserir lead:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Lead salvo com sucesso:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead salvo com sucesso',
        data
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro na função save-lead:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
