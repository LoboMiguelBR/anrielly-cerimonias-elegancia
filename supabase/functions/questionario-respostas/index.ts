
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SaveRequest {
  questionarioId: string
  respostas: Record<string, string>
  finalizar?: boolean
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

    const { questionarioId, respostas, finalizar = false } = await req.json() as SaveRequest

    console.log('Salvando respostas:', { questionarioId, finalizar, totalRespostas: Object.keys(respostas).length })

    // Determinar o novo status
    const novoStatus = finalizar ? 'preenchido' : 'rascunho'

    // Atualizar respostas
    const { data, error } = await supabaseClient
      .from('questionarios_noivos')
      .update({
        respostas_json: respostas,
        status: novoStatus
      })
      .eq('id', questionarioId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar respostas:', error)
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar respostas' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Respostas salvas com sucesso:', { questionarioId, status: novoStatus })

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: novoStatus,
        message: finalizar ? 'Questionário finalizado com sucesso!' : 'Respostas salvas com sucesso!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
