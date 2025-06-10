
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  action_url?: string;
  metadata?: Record<string, any>;
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

    if (req.method === 'POST') {
      const { user_id, title, message, type = 'info', action_url, metadata = {} }: NotificationRequest = await req.json()

      // Validar dados obrigatórios
      if (!user_id || !title || !message) {
        return new Response(
          JSON.stringify({ error: 'user_id, title e message são obrigatórios' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Inserir notificação
      const { data, error } = await supabaseClient
        .from('notifications')
        .insert([{
          user_id,
          title,
          message,
          type,
          action_url,
          metadata,
          read: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar notificação:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao criar notificação' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Enviar notificação em tempo real via Realtime
      const channel = supabaseClient.channel(`notifications:${user_id}`)
      channel.send({
        type: 'broadcast',
        event: 'new_notification',
        payload: data
      })

      return new Response(
        JSON.stringify({ success: true, notification: data }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const user_id = url.searchParams.get('user_id')
      const unread_only = url.searchParams.get('unread_only') === 'true'

      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'user_id é obrigatório' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      let query = supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      if (unread_only) {
        query = query.eq('read', false)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar notificações:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao buscar notificações' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ notifications: data }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'PUT') {
      const { notification_id, read = true } = await req.json()

      if (!notification_id) {
        return new Response(
          JSON.stringify({ error: 'notification_id é obrigatório' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data, error } = await supabaseClient
        .from('notifications')
        .update({ read })
        .eq('id', notification_id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar notificação:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao atualizar notificação' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, notification: data }),
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
