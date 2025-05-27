import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  name: string
  email: string
  type: 'welcome' | 'completed'
  questionarioId?: string
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const getWelcomeEmailTemplate = (name: string) => `
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
      <div class="logo">
        <img src="https://544e400e-7788-4e91-b981-e8bcbb39dd2f.lovableproject.com/LogoAG_512x512.png" alt="Anrielly Gomes Logo" onerror="this.style.display='none'; this.parentElement.innerHTML='💕';" />
      </div>
      <h1>Anrielly Gomes</h1>
      <p class="subtitle">Mestre de Cerimônia</p>
      <p>Celebrando o amor de vocês</p>
    </div>
    
    <div class="content">
      <h2>Olá, ${name}! 💖</h2>
      
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

const getCompletedEmailTemplate = (name: string) => `
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
      <div class="logo">
        <img src="https://544e400e-7788-4e91-b981-e8bcbb39dd2f.lovableproject.com/LogoAG_512x512.png" alt="Anrielly Gomes Logo" onerror="this.style.display='none'; this.parentElement.innerHTML='🎉';" />
      </div>
      <h1>Parabéns, ${name}!</h1>
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, type, questionarioId }: EmailRequest = await req.json()

    console.log('Email request received:', { name, email, type, questionarioId })

    if (!name || !email || !type) {
      return new Response(
        JSON.stringify({ error: 'Nome, email e tipo são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let subject: string
    let html: string

    if (type === 'welcome') {
      subject = '💕 Bem-vindo(a) ao Questionário de Noivos - Anrielly Gomes'
      html = getWelcomeEmailTemplate(name)
    } else if (type === 'completed') {
      subject = '🎉 Questionário Finalizado com Sucesso! - Anrielly Gomes'
      html = getCompletedEmailTemplate(name)
    } else {
      return new Response(
        JSON.stringify({ error: 'Tipo de email inválido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Enviar email para o cliente
    const emailResponse = await resend.emails.send({
      from: 'Anrielly Gomes <contato@anriellygomes.com.br>',
      to: [email],
      subject,
      html
    })

    console.log('Email enviado para cliente:', emailResponse)

    // Se for email de finalização, enviar também para contato@anriellygomes.com.br
    if (type === 'completed') {
      const notificationSubject = `🔔 Questionário Finalizado - ${name}`
      const notificationHtml = `
        <h2>Novo questionário finalizado!</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>ID do Questionário:</strong> ${questionarioId || 'N/A'}</p>
        <p>Acesse o painel administrativo para visualizar as respostas completas.</p>
      `

      const notificationResponse = await resend.emails.send({
        from: 'Sistema <contato@anriellygomes.com.br>',
        to: ['contato@anriellygomes.com.br'],
        subject: notificationSubject,
        html: notificationHtml
      })

      console.log('Email de notificação enviado:', notificationResponse)
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return new Response(
      JSON.stringify({ error: 'Erro ao enviar email', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
