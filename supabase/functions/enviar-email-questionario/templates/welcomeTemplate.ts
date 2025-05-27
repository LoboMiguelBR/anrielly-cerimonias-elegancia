
export const getWelcomeEmailTemplate = (name: string) => `
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
