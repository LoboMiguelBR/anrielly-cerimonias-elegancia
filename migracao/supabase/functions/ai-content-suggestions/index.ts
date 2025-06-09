
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  type: 'contract_text' | 'email_template' | 'budget_description'
  context: {
    event_type?: string
    client_name?: string
    template_type?: string
    service_description?: string
  }
}

const generatePrompts = (type: string, context: any): string => {
  switch (type) {
    case 'contract_text':
      return `Como especialista em contratos para eventos, crie cláusulas profissionais para um contrato de ${context.event_type || 'evento'}. 
      Inclua: responsabilidades, condições de pagamento, política de cancelamento, e direitos autorais.
      Mantenha tom profissional mas acessível. Máximo 500 palavras.`
    
    case 'email_template':
      return `Crie um email profissional para ${context.template_type || 'comunicação com cliente'}. 
      Contexto: Serviços de Mestre de Cerimônia para ${context.event_type || 'evento'}.
      Tom: Profissional, caloroso e personalizado. Cliente: ${context.client_name || '[Nome do Cliente]'}.
      Máximo 300 palavras.`
    
    case 'budget_description':
      return `Crie uma descrição profissional para o serviço: "${context.service_description || 'serviço de evento'}".
      Destaque benefícios, o que está incluso, e valor agregado.
      Tom: Comercial mas elegante. Máximo 150 palavras.`
    
    default:
      return 'Crie um texto profissional para eventos.'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, context } = await req.json() as AIRequest
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = generatePrompts(type, context)
    
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
            content: 'Você é um especialista em eventos e comunicação profissional. Sempre responda em português brasileiro.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.choices[0]?.message?.content || 'Erro ao gerar conteúdo'

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedText.trim(),
        type 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in AI content suggestions:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao gerar sugestão de conteúdo',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
