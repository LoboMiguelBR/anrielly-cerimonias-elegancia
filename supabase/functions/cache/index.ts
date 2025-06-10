
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CacheRequest {
  key: string;
  value?: any;
  ttl?: number; // Time to live em segundos
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const key = url.searchParams.get('key')

      if (!key) {
        return new Response(
          JSON.stringify({ error: 'Cache key é obrigatório' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Buscar cache e verificar se não expirou
      const { data, error } = await supabaseClient
        .from('cache_entries')
        .select('*')
        .eq('cache_key', key)
        .gte('expires_at', new Date().toISOString())
        .single()

      if (error) {
        // Cache miss ou expirado
        return new Response(
          JSON.stringify({ cached: false, value: null }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ cached: true, value: data.cache_value }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const { key, value, ttl = 3600 }: CacheRequest = await req.json() // TTL padrão: 1 hora

      if (!key || value === undefined) {
        return new Response(
          JSON.stringify({ error: 'Cache key e value são obrigatórios' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const expiresAt = new Date(Date.now() + ttl * 1000).toISOString()

      // Upsert cache entry
      const { data, error } = await supabaseClient
        .from('cache_entries')
        .upsert([{
          cache_key: key,
          cache_value: value,
          expires_at: expiresAt
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar cache:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao salvar cache' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, cached_until: expiresAt }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'DELETE') {
      const { key } = await req.json()

      if (!key) {
        return new Response(
          JSON.stringify({ error: 'Cache key é obrigatório' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabaseClient
        .from('cache_entries')
        .delete()
        .eq('cache_key', key)

      if (error) {
        console.error('Erro ao deletar cache:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao deletar cache' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Limpar cache expirado
    if (req.method === 'POST' && req.url.includes('/clean')) {
      const { error } = await supabaseClient.rpc('clean_expired_cache')

      if (error) {
        console.error('Erro ao limpar cache:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao limpar cache' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Cache expirado limpo' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro na edge function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
