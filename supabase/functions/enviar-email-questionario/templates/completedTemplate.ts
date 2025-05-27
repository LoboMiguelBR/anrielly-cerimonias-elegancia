
export const getCompletedEmailTemplate = (name: string) => `
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
