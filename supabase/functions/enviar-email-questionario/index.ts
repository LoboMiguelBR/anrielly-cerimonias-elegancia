
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { emailSender } from './utils/emailSender.ts'
import { emailValidator } from './utils/emailValidator.ts'
import { welcomeTemplate } from './templates/welcomeTemplate.ts'
import { completedTemplate } from './templates/completedTemplate.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  questionarioId: string
  tipo: 'boas-vindas' | 'finalizacao'
}

// Função para gerar história com IA
const generateStoryWithAI = async (respostas: Record<string, any>): Promise<string | null> => {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.log('OpenAI API key not found, skipping story generation')
      return null
    }

    // Criar prompt baseado nas respostas
    const prompt = `Com base nas seguintes respostas de um questionário de casamento, crie um resumo narrativo romântico e envolvente da história deste casal. 
    
    Use as informações fornecidas para criar uma narrativa coesa e emotiva sobre como eles se conheceram, sua jornada juntos e seus planos para o futuro.
    
    Respostas do questionário:
    ${JSON.stringify(respostas, null, 2)}
    
    Crie um texto em português brasileiro, máximo 800 palavras, focando nos momentos especiais e na evolução do relacionamento.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criar narrativas românticas para casais. Sempre escreva em português brasileiro com tom emotivo e elegante.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || null

  } catch (error) {
    console.error('Error generating story with AI:', error)
    return null
  }
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

    const { questionarioId, tipo } = await req.json() as EmailRequest

    console.log('Processando email:', { questionarioId, tipo })

    // Buscar dados do questionário
    const { data: questionario, error } = await supabaseClient
      .from('questionarios_noivos')
      .select('*')
      .eq('id', questionarioId)
      .single()

    if (error || !questionario) {
      console.error('Erro ao buscar questionário:', error)
      return new Response(
        JSON.stringify({ error: 'Questionário não encontrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Validar email
    if (!emailValidator.isValidEmail(questionario.email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let emailData
    let updateData: any = {}

    if (tipo === 'boas-vindas') {
      emailData = welcomeTemplate(questionario)
    } else if (tipo === 'finalizacao') {
      emailData = completedTemplate(questionario)
      
      // Gerar história com IA se ainda não foi processada
      if (!questionario.historia_processada && questionario.respostas_json) {
        console.log('Gerando história com IA...')
        const historia = await generateStoryWithAI(questionario.respostas_json)
        
        if (historia) {
          updateData = {
            historia_gerada: historia,
            historia_processada: true
          }
          console.log('História gerada com sucesso')
        } else {
          updateData = {
            historia_processada: true // Marca como processada mesmo se falhou
          }
          console.log('Falha ao gerar história, mas marcando como processada')
        }
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Tipo de email inválido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Atualizar questionário com história se gerada
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseClient
        .from('questionarios_noivos')
        .update(updateData)
        .eq('id', questionarioId)

      if (updateError) {
        console.error('Erro ao atualizar questionário:', updateError)
        // Não falha o processo de email por conta disso
      }
    }

    // Enviar email
    const emailResult = await emailSender.sendEmail(emailData)

    if (!emailResult.success) {
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar email', details: emailResult.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Email enviado com sucesso:', tipo)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        historia_gerada: updateData.historia_gerada ? true : false
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
