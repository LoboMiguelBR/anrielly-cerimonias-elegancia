
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
      console.log('Construindo prompt personalizado...')
      
      const linguagemCelebrante = personalizacao.linguagem_celebrante || 'celebrante especialista'
      const tipoCerimonia = personalizacao.tipo_cerimonia || 'tradicional'
      const tomConversa = personalizacao.tom_conversa || 'romântico'
      const tagsEmocao = personalizacao.tags_emocao?.join(', ') || 'amor e leveza'
      
      prompt = `Você é um ${linguagemCelebrante} de cerimônias do tipo ${tipoCerimonia}.
Sua missão é criar uma história com um tom ${tomConversa} e emoção baseada em: ${tagsEmocao}.

${personalizacao.incluir_votos ? 'Inclua também votos personalizados baseados nas respostas dos noivos.' : ''}
${personalizacao.incluir_aliancas ? 'Descreva a troca de alianças de forma simbólica e emocionante.' : ''}
${personalizacao.momento_especial ? `Momento especial a destacar: ${personalizacao.momento_especial}` : ''}
${personalizacao.contexto_cultural ? `Adapte o texto para o contexto cultural: ${personalizacao.contexto_cultural}` : ''}
${personalizacao.observacoes_adicionais ? `Observações adicionais: ${personalizacao.observacoes_adicionais}` : ''}

Crie um texto que conte a trajetória do casal, destacando:
- Como se conheceram;
- As primeiras impressões um do outro;
- Os momentos marcantes, desafios, superações e alegrias;
- Curiosidades do relacionamento (como apelidos, manias e brincadeiras);
- Características que um admira no outro;
- O que eles mais gostam de fazer juntos;
- O que esperam do futuro e da família que estão formando.

A história deve ser contada de forma natural, espontânea, como se fosse um celebrante falando, com amor, carinho, emoção e leveza.

Aqui estão as informações coletadas dos dois noivos:

${respostasNoiva}

${respostasNoivo}

Gere uma história única, emocionante e inesquecível para ser lida durante a cerimônia de casamento. O texto deve ter entre 3-5 parágrafos e ser adequado para leitura em uma cerimônia de casamento.`
    } else {
      console.log('Usando prompt padrão (sem personalização)...')
      
      prompt = `Você é um especialista em contar histórias de amor para cerimônias de casamento. Sua missão é transformar as respostas dos questionários de dois noivos em uma narrativa romântica, envolvente, emocionante e com toques de humor leve e saudável.

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
    }

    console.log('Calling OpenAI API...')

    // Chamar OpenAI com retry logic
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

    console.log('Story generated successfully, length:', historiaGerada.length)

    // Salvar a história em todos os questionários do mesmo link_publico
    console.log('Saving story to database...')
    
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

    console.log('Story saved successfully to database')

    const mensagem = personalizacao 
      ? 'História personalizada gerada com sucesso!' 
      : 'História do casal gerada com sucesso!'

    return new Response(
      JSON.stringify({ 
        success: true, 
        historia: historiaGerada,
        message: mensagem,
        personalizada: !!personalizacao,
        debug: {
          noivosProcessados: noivos.length,
          historiaLength: historiaGerada.length,
          temPersonalizacao: !!personalizacao
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
