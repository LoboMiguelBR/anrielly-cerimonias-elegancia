
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

    // Se estiver finalizando, enviar emails
    if (finalizar && data) {
      try {
        console.log('Enviando email de confirmação para:', data.email)
        
        // Email de confirmação para o casal
        const emailCasalResponse = await supabaseClient.functions.invoke('enviar-email-questionario', {
          body: {
            questionarioId: questionarioId,
            tipo: 'finalizacao'
          }
        })

        if (emailCasalResponse.error) {
          console.error('Erro ao enviar email para o casal:', emailCasalResponse.error)
        } else {
          console.log('Email de confirmação enviado para o casal')
        }

        // Email de notificação para o administrador
        console.log('Enviando notificação para administrador')
        const emailAdminResponse = await supabaseClient.functions.invoke('enviar-email', {
          body: {
            name: data.nome_responsavel,
            email: 'contato@anriellygomes.com.br',
            questionarioId: questionarioId,
            tipo: 'questionario-concluido'
          }
        })

        if (emailAdminResponse.error) {
          console.error('Erro ao enviar notificação para administrador:', emailAdminResponse.error)
        } else {
          console.log('Notificação enviada para administrador')
        }

      } catch (emailError) {
        console.error('Erro ao enviar emails:', emailError)
        // Não falha a operação por causa do email
      }
    }

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
