
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GerarHistoriaRequest {
  link_publico: string
  noivos: Array<{
    nome: string
    email: string
    respostas: Record<string, string>
  }>
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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { link_publico, noivos } = await req.json() as GerarHistoriaRequest

    console.log('Gerando história para casal:', { link_publico, noivos: noivos.map(n => n.nome) })

    if (noivos.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'São necessários pelo menos 2 questionários completos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Formatar as respostas para o prompt
    const formatarRespostas = (noivo: typeof noivos[0]) => {
      const respostasFormatadas = Object.entries(noivo.respostas)
        .filter(([_, resposta]) => resposta && resposta.trim() !== '')
        .map(([perguntaIndex, resposta]) => `Pergunta ${parseInt(perguntaIndex) + 1}: ${resposta}`)
        .join('\n')
      
      return `=== RESPOSTAS DE ${noivo.nome.toUpperCase()} ===\n${respostasFormatadas}\n`
    }

    const respostasNoiva = formatarRespostas(noivos[0])
    const respostasNoivo = formatarRespostas(noivos[1])

    // Prompt profissional para geração da história
    const prompt = `Você é um especialista em contar histórias de amor para cerimônias de casamento. Sua missão é transformar as respostas dos questionários de dois noivos em uma narrativa romântica, envolvente, emocionante e com toques de humor leve e saudável.

Crie um texto que conte a trajetória do casal, destacando:
- Como se conheceram;
- As primeiras impressões um do outro;
- Os momentos marcantes, desafios, superações e alegrias;
- Curiosidades do relacionamento (como apelidos, manias e brincadeiras);
- Características que um admira no outro;
- O que eles mais gostam de fazer juntos;
- O que esperam do futuro e da família que estão formando.

A história deve ser contada de forma natural, espontânea, como se fosse um celebrante falando, com amor, carinho, emoção e leveza.

Adote um tom romântico, poético e divertido. Use palavras que transmitam sensibilidade, amor e conexão.

Aqui estão as informações coletadas dos dois noivos:

${respostasNoiva}

${respostasNoivo}

Gere agora uma história incrível, inesquecível, emocionante e encantadora sobre esse casal. O texto deve ter entre 3-5 parágrafos e ser adequado para leitura em uma cerimônia de casamento.`

    // Chamar OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criar histórias românticas e emocionantes para casamentos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      throw new Error('Erro ao gerar história com IA')
    }

    const openaiData = await openaiResponse.json()
    const historiaGerada = openaiData.choices[0].message.content

    console.log('História gerada com sucesso, salvando no banco...')

    // Salvar a história em todos os questionários do mesmo link_publico
    const { error: updateError } = await supabaseClient
      .from('questionarios_noivos')
      .update({
        historia_gerada: historiaGerada,
        historia_processada: true
      })
      .eq('link_publico', link_publico)

    if (updateError) {
      console.error('Erro ao salvar história:', updateError)
      throw new Error('Erro ao salvar história no banco de dados')
    }

    console.log('História salva com sucesso!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        historia: historiaGerada,
        message: 'História do casal gerada com sucesso!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na função gerar-historia-casal:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
