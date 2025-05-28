
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  questionarioId: string
  tipo: 'boas-vindas' | 'finalizacao'
}

// Email sender utility
const emailSender = {
  async sendEmail(emailData: any) {
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY not configured')
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
          to: [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }
  }
}

// Email validator utility
const emailValidator = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Welcome template
const welcomeTemplate = (questionario: any) => ({
  to: questionario.email,
  subject: '🌸 Bem-vindo(a) ao Questionário de Noivos!',
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo(a) ao Questionário de Noivos</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #fdf2f8; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #f43f5e, #ec4899); color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 5px 0 0 0; font-size: 24px; font-weight: 600; }
    .header .subtitle { margin: 5px 0 0 0; font-size: 16px; font-weight: 400; }
    .content { padding: 30px; }
    .content h2 { color: #be185d; margin-bottom: 20px; }
    .highlight { background-color: #fdf2f8; padding: 20px; border-left: 4px solid #f43f5e; margin: 20px 0; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
    .logo { width: 60px; height: 60px; margin: 0 auto 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: rgba(255,255,255,0.1); }
    .logo img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">💕</div>
      <h1>Anrielly Gomes</h1>
      <p class="subtitle">Mestre de Cerimônia</p>
      <p>Celebrando o amor de vocês</p>
    </div>
    
    <div class="content">
      <h2>Olá, ${questionario.nome_responsavel}! 💖</h2>
      
      <p>Seja muito bem-vindo(a) ao nosso <strong>Questionário de Celebração do Amor</strong>!</p>
      
      <p>É uma alegria enorme ter vocês conosco nesta jornada especial. Este questionário foi criado com muito carinho para conhecer melhor a história de vocês e tornar a cerimônia ainda mais única e personalizada.</p>
      
      <div class="highlight">
        <h3>💝 Uma mensagem especial para você:</h3>
        <p>Lembre-se de que este não é apenas um formulário... é um momento para refletir, reviver memórias lindas e contar a história de vocês com todo o amor que ela merece.</p>
      </div>
      
      <p><strong>Dicas importantes:</strong></p>
      <ul>
        <li>🕰️ Não tenha pressa! Responda no seu tempo</li>
        <li>💾 Suas respostas são salvas automaticamente a cada 60"</li>
        <li>🔄 Você pode voltar a qualquer momento para continuar</li>
        <li>❤️ Seja sincero(a) e verdadeiro(a) - isso nos ajuda muito!</li>
      </ul>
      
      <p>Estamos ansiosos para conhecer todos os detalhes da linda história de vocês!</p>
      
      <p>Com carinho,<br>
      <strong>Anrielly Gomes</strong><br>
      Mestre de Cerimônia</p>
    </div>
    
    <div class="footer">
      <p>📧 contato@anriellygomes.com.br | 📱 (24) 99268-9947 (WhatsApp)</p>
      <p>Este é um email automático, mas fique à vontade para responder se tiver dúvidas!</p>
    </div>
  </div>
</body>
</html>
`
})

// Completed template
const completedTemplate = (questionario: any) => ({
  to: questionario.email,
  subject: '🎉 Questionário Finalizado com Sucesso!',
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Questionário Finalizado com Sucesso!</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #fdf2f8; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 5px 0 0 0; font-size: 24px; font-weight: 600; }
    .header .subtitle { margin: 5px 0 0 0; font-size: 16px; font-weight: 400; }
    .content { padding: 30px; }
    .content h2 { color: #059669; margin-bottom: 20px; }
    .celebration { background: linear-gradient(135deg, #fef3c7, #fbbf24); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0; }
    .celebration h2 { color: #1f2937; margin-bottom: 15px; }
    .celebration p { color: #374151; font-size: 18px; margin: 0; font-weight: bold; }
    .next-steps { background-color: #f0fdfa; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
    .logo { width: 60px; height: 60px; margin: 0 auto 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: rgba(255,255,255,0.1); }
    .logo img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎉</div>
      <h1>Parabéns, ${questionario.nome_responsavel}!</h1>
      <p class="subtitle">Anrielly Gomes - Mestre de Cerimônia</p>
      <p>Questionário finalizado com sucesso!</p>
    </div>
    
    <div class="content">
      <div class="celebration">
        <h2>🎊 MUITO OBRIGADA! 🎊</h2>
        <p>Você é incrível!</p>
      </div>
      
      <p>Que alegria imensa receber o seu questionário completo! ✨</p>
      
      <p>Cada palavra, cada resposta, cada detalhe que você compartilhou conosco é um tesouro que nos ajudará a criar uma cerimônia verdadeiramente única e especial para vocês.</p>
      
      <div class="next-steps">
        <h3>🌟 Próximos passos:</h3>
        <ul>
          <li>📖 Vamos estudar cuidadosamente cada resposta</li>
          <li>💝 Preparar um roteiro personalizado para vocês</li>
          <li>📞 Entraremos em contato em breve para alinhar os detalhes</li>
          <li>✨ Começar a criar a cerimônia dos sonhos de vocês!</li>
        </ul>
      </div>
      
      <p>A história de vocês é linda e será uma honra ajudar a celebrá-la da forma mais especial possível.</p>
      
      <p><strong>Gratidão</strong> por confiarem em nosso trabalho e por compartilharem momentos tão preciosos conosco. ❤️</p>
      
      <p>Até breve!<br>
      <strong>Anrielly Gomes</strong><br>
      Mestre de Cerimônia</p>
    </div>
    
    <div class="footer">
      <p>📧 contato@anriellygomes.com.br | 📱 (24) 99268-9947 (WhatsApp)</p>
      <p>Fique à vontade para entrar em contato se tiver alguma dúvida!</p>
    </div>
  </div>
</body>
</html>
`
})

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
