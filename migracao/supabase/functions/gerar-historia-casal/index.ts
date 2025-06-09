
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
  console.log(`[${new Date().toISOString()}] Request received: ${req.method}`)
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    console.log('Environment check:', {
      supabaseUrl: supabaseUrl ? '✓ Set' : '✗ Missing',
      supabaseServiceKey: supabaseServiceKey ? '✓ Set' : '✗ Missing',
      openaiApiKey: openaiApiKey ? '✓ Set' : '✗ Missing'
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Validar e parsear request body
    let requestBody
    try {
      requestBody = await req.json()
      console.log('Request body parsed successfully:', {
        hasLinkPublico: !!requestBody.link_publico,
        noivosCount: requestBody.noivos?.length || 0
      })
    } catch (error) {
      console.error('Error parsing request body:', error)
      throw new Error('Invalid JSON in request body')
    }

    const { link_publico, noivos } = requestBody as GerarHistoriaRequest

    // Validações detalhadas
    if (!link_publico) {
      throw new Error('link_publico é obrigatório')
    }

    if (!noivos || !Array.isArray(noivos)) {
      throw new Error('noivos deve ser um array')
    }

    if (noivos.length < 2) {
      console.log('Insufficient questionnaires:', { count: noivos.length })
      return new Response(
        JSON.stringify({ success: false, error: 'São necessários pelo menos 2 questionários completos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Validation passed:', {
      link_publico,
      noivos: noivos.map(n => ({ nome: n.nome, respostasCount: Object.keys(n.respostas || {}).length }))
    })

    // Buscar personalização da IA
    console.log('Buscando personalização IA...')
    const { data: personalizacao, error: personalizacaoError } = await supabaseClient
      .from('personalizacoes_ia')
      .select('*')
      .eq('link_publico', link_publico)
      .maybeSingle()

    if (personalizacaoError) {
      console.warn('Erro ao buscar personalização (continuando sem):', personalizacaoError)
    }

    console.log('Personalização encontrada:', !!personalizacao)

    // Formatar as respostas para o prompt
    const formatarRespostas = (noivo: typeof noivos[0]) => {
      if (!noivo.respostas) {
        console.warn(`Noivo ${noivo.nome} não tem respostas`)
        return `=== RESPOSTAS DE ${noivo.nome.toUpperCase()} ===\nNenhuma resposta disponível\n`
      }

      const respostasFormatadas = Object.entries(noivo.respostas)
        .filter(([_, resposta]) => resposta && resposta.trim() !== '')
        .map(([perguntaIndex, resposta]) => `Pergunta ${parseInt(perguntaIndex) + 1}: ${resposta}`)
        .join('\n')
      
      return `=== RESPOSTAS DE ${noivo.nome.toUpperCase()} ===\n${respostasFormatadas}\n`
    }

    const respostasNoiva = formatarRespostas(noivos[0])
    const respostasNoivo = formatarRespostas(noivos[1])

    console.log('Formatted responses:', {
      noiva: respostasNoiva.length,
      noivo: respostasNoivo.length
    })

    // Construir prompt baseado na personalização (se existir)
    let prompt = ''
    
    if (personalizacao) {
      console.log('Construindo prompt personalizado avançado...')
      
      const linguagemCelebrante = personalizacao.linguagem_celebrante || 'celebrante especialista'
      const tipoCerimonia = personalizacao.tipo_cerimonia || 'tradicional'
      const tomConversa = personalizacao.tom_conversa || 'romântico'
      const tagsEmocao = personalizacao.tags_emocao?.join(', ') || 'amor e leveza'
      const momentoEspecial = personalizacao.momento_especial || ''
      const contexto = personalizacao.contexto_cultural || ''
      const observacoes = personalizacao.observacoes_adicionais || ''
      
      prompt = `Você é um ${linguagemCelebrante} especializado em criar histórias emocionantes para cerimônias do tipo ${tipoCerimonia}.

INSTRUÇÕES FUNDAMENTAIS:
- Crie uma história LONGA, DETALHADA e EMOCIONANTE (não se limite a parágrafos curtos)
- Use um tom ${tomConversa} e transmita emoções de: ${tagsEmocao}
- Esta história será lida durante a cerimônia, então deve ser cativante e tocante
- NÃO SE LIMITE ao tamanho - quanto mais rica em detalhes, melhor
- Conte a história como se fosse uma narrativa envolvente, não apenas fatos

${observacoes ? `INSTRUÇÕES ESPECIAIS: ${observacoes}` : ''}

ELEMENTOS OBRIGATÓRIOS A INCLUIR NA HISTÓRIA:
1. Como eles se conheceram (primeiras impressões, cenário, sentimentos)
2. Os primeiros momentos juntos (como foi o desenvolvimento da relação)
3. Momentos marcantes da relação (viagens, conquistas, desafios superados)
4. Características que um admira no outro (personalidade, qualidades únicas)
5. Tradições, rituais ou coisas especiais que eles fazem juntos
6. Como eles se complementam e cresceram juntos
7. Sonhos e planos para o futuro
8. O que a família e amigos veem neles como casal

${momentoEspecial ? `MOMENTO ESPECIAL A DESTACAR: ${momentoEspecial}` : ''}
${contexto ? `ADAPTE PARA O CONTEXTO: ${contexto}` : ''}

${personalizacao.incluir_votos ? `
INCLUIR VOTOS PERSONALIZADOS:
- Baseie-se nas respostas para criar votos únicos que cada um faria ao outro
- Incorpore as palavras e sentimentos expressos nos questionários
` : ''}

${personalizacao.incluir_aliancas ? `
INCLUIR MOMENTO DAS ALIANÇAS:
- Descreva de forma simbólica e emocionante o significado da troca de alianças
- Conecte com a jornada do casal até este momento
` : ''}

FORMATO DA RESPOSTA:
- Crie uma narrativa fluida e envolvente em 5-8 parágrafos substanciais
- Cada parágrafo deve ter pelo menos 4-6 frases detalhadas
- Use linguagem poética mas acessível
- Inclua detalhes específicos baseados nas respostas dos questionários
- Faça com que quem ouvir se emocione e se conecte com a história

Aqui estão as respostas dos questionários:

${respostasNoiva}

${respostasNoivo}

Agora, crie uma história magnífica, detalhada e emocionante sobre este casal, sem se preocupar com o tamanho do texto.`
    } else {
      console.log('Usando prompt padrão aprimorado (sem personalização)...')
      
      prompt = `Você é um especialista em contar histórias de amor emocionantes para cerimônias de casamento. Sua missão é transformar as respostas dos questionários em uma narrativa LONGA, DETALHADA e PROFUNDAMENTE TOCANTE.

INSTRUÇÕES FUNDAMENTAIS:
- Crie uma história EXTENSA e RICA EM DETALHES (não se limite a parágrafos curtos)
- Esta história será lida durante a cerimônia, então deve ser emocionante e cativante
- NÃO SE PREOCUPE com o tamanho - quanto mais detalhada e envolvente, melhor
- Use linguagem poética, romântica e carregada de emoção

ELEMENTOS OBRIGATÓRIOS A INCLUIR:
1. Como se conheceram (cenário completo, primeiras impressões detalhadas)
2. Desenvolvimento da relação (primeiros encontros, como o amor floresceu)
3. Momentos marcantes e especiais (viagens, conquistas, surpresas)
4. Desafios superados juntos (como se fortaleceram nas dificuldades)
5. Características únicas que um admira no outro
6. Tradições, brincadeiras e rituais especiais do casal
7. Como eles se complementam e evoluíram juntos
8. Sonhos, planos e visão de futuro
9. O que família e amigos veem neles

FORMATO DA RESPOSTA:
- 6-10 parágrafos substanciais e detalhados
- Cada parágrafo com 5-8 frases ricas em detalhes
- Tom romântico, poético e emocionante
- Use palavras que transmitam sensibilidade, amor e conexão profunda
- Inclua momentos específicos baseados nas respostas
- Faça a plateia se emocionar e se conectar com a história

TOME COMO BASE as informações dos questionários:

${respostasNoiva}

${respostasNoivo}

Crie agora uma história MAGNÍFICA, LONGA e INESQUECÍVEL sobre este casal. Não se limite - quanto mais rica e detalhada, melhor será a experiência na cerimônia.`
    }

    console.log('Calling OpenAI API with enhanced prompt...')

    // Chamar OpenAI com configurações aprimoradas
    let openaiResponse
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        console.log(`OpenAI API attempt ${retryCount + 1}/${maxRetries}`)
        
        openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: 'Você é um especialista em criar histórias românticas longas, detalhadas e profundamente emocionantes para casamentos. Nunca limite o tamanho do texto - quanto mais rica e envolvente a história, melhor.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 4000, // Aumentado significativamente
            presence_penalty: 0.1,
            frequency_penalty: 0.1
          }),
        })

        console.log('OpenAI response status:', openaiResponse.status)

        if (openaiResponse.ok) {
          break
        } else {
          const errorText = await openaiResponse.text()
          console.error(`OpenAI API error (attempt ${retryCount + 1}):`, {
            status: openaiResponse.status,
            statusText: openaiResponse.statusText,
            error: errorText
          })
          
          if (retryCount === maxRetries - 1) {
            throw new Error(`OpenAI API failed after ${maxRetries} attempts: ${openaiResponse.status} ${openaiResponse.statusText}`)
          }
        }
      } catch (error) {
        console.error(`OpenAI request error (attempt ${retryCount + 1}):`, error)
        if (retryCount === maxRetries - 1) {
          throw error
        }
      }
      
      retryCount++
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
    }

    if (!openaiResponse) {
      throw new Error('Failed to get response from OpenAI after retries')
    }

    const openaiData = await openaiResponse.json()
    console.log('OpenAI response parsed successfully')

    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      console.error('Invalid OpenAI response structure:', openaiData)
      throw new Error('Invalid response structure from OpenAI')
    }

    const historiaGerada = openaiData.choices[0].message.content

    if (!historiaGerada || historiaGerada.trim() === '') {
      throw new Error('OpenAI returned empty story content')
    }

    console.log('Enhanced story generated successfully, length:', historiaGerada.length, 'characters')

    // Salvar a história em todos os questionários do mesmo link_publico
    console.log('Saving enhanced story to database...')
    
    const { error: updateError } = await supabaseClient
      .from('questionarios_noivos')
      .update({
        historia_gerada: historiaGerada,
        historia_processada: true
      })
      .eq('link_publico', link_publico)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Erro ao salvar história no banco de dados: ${updateError.message}`)
    }

    console.log('Enhanced story saved successfully to database')

    const mensagem = personalizacao 
      ? 'História personalizada e detalhada gerada com sucesso!' 
      : 'História completa e emocionante gerada com sucesso!'

    return new Response(
      JSON.stringify({ 
        success: true, 
        historia: historiaGerada,
        message: mensagem,
        personalizada: !!personalizacao,
        debug: {
          noivosProcessados: noivos.length,
          historiaLength: historiaGerada.length,
          temPersonalizacao: !!personalizacao,
          caracteresGerados: historiaGerada.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in gerar-historia-casal function:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
