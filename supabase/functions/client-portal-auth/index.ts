import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  token: string
  userAgent?: string
  ipAddress?: string
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

    const { token, userAgent, ipAddress } = await req.json() as AuthRequest

    console.log('Portal auth attempt:', { token: token?.substring(0, 8) + '...', hasUserAgent: !!userAgent })

    // Verificar token de acesso
    const { data: portalAccess, error: accessError } = await supabaseClient
      .from('client_portal_access')
      .select(`
        *,
        client:clientes(*)
      `)
      .eq('access_token', token)
      .eq('is_active', true)
      .maybeSingle()

    if (accessError) {
      console.error('Error checking portal access:', accessError)
      return new Response(
        JSON.stringify({ error: 'Erro interno do servidor' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!portalAccess) {
      console.log('Invalid or inactive token')
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verificar expiração se definida
    if (portalAccess.expires_at && new Date(portalAccess.expires_at) < new Date()) {
      console.log('Token expired')
      return new Response(
        JSON.stringify({ error: 'Token expirado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Criar sessão
    const { data: session, error: sessionError } = await supabaseClient
      .from('client_portal_sessions')
      .insert({
        access_token_id: portalAccess.id,
        user_agent: userAgent,
        ip_address: ipAddress
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Erro ao criar sessão' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Atualizar contador de acesso
    await supabaseClient
      .from('client_portal_access')
      .update({
        last_accessed: new Date().toISOString(),
        access_count: portalAccess.access_count + 1
      })
      .eq('id', portalAccess.id)

    console.log('Portal authentication successful')

    return new Response(
      JSON.stringify({
        success: true,
        sessionToken: session.session_token,
        client: portalAccess.client,
        expiresAt: session.expires_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in portal auth function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})