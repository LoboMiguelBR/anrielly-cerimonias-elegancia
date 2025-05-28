const generateContractHTML = (contract: ContractData) => {
  const clientSignature = contract.signature_data?.signature || contract.preview_signature_url;
  const signedAt = contract.signed_at || contract.signature_drawn_at;
  const auditData = contract.signature_data || {};

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Contrato - ${contract.client_name}</title>
        <style>
          body {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            background-color: #FAFAFC;
            color: #222222;
          }

          .contract {
            max-width: 850px;
            margin: 40px auto;
            background-color: #FFFFFF;
            padding: 40px;
            border: 2px solid #C6257E;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(198, 37, 126, 0.15);
          }

          .contract h1 {
            color: #C6257E;
            text-align: center;
            border-bottom: 2px solid #C6257E;
            padding-bottom: 12px;
            margin-bottom: 25px;
            font-weight: bold;
          }

          .contract h2 {
            color: #C6257E;
            margin-top: 30px;
            border-left: 5px solid #E2C572;
            padding-left: 12px;
          }

          .contract p {
            line-height: 1.8;
            margin-bottom: 15px;
            color: #222222;
            font-size: 16px;
          }

          .contract ul {
            margin: 10px 0 20px 25px;
          }

          .contract ul li {
            margin-bottom: 6px;
          }

          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            gap: 30px;
          }

          .signature-box {
            width: 48%;
            text-align: center;
            border-top: 2px solid #C6257E;
            padding-top: 12px;
          }

          .signature-image img {
            width: 100%;
            max-width: 300px;
            margin-top: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .auth-footer {
            margin-top: 50px;
            padding: 15px;
            background-color: #FAFAFC;
            border: 1px solid #E2C572;
            border-radius: 8px;
            font-size: 13px;
            color: #666;
          }

          .auth-footer .version-info {
            margin-top: 10px;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="contract">
          <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MESTRE DE CERIMÔNIA</h1>

          <p>Pelo presente instrumento particular, as partes abaixo qualificadas:</p>

          <h2>CONTRATANTE</h2>
          <p>
            Nome: <strong>${contract.client_name}</strong><br>
            Estado Civil: <strong>${contract.civil_status}</strong><br>
            Profissão: <strong>${contract.client_profession}</strong><br>
            Endereço: <strong>${contract.client_address}</strong><br>
            Telefone: <strong>${contract.client_phone}</strong><br>
            E-mail: <strong>${contract.client_email}</strong>
          </p>

          <h2>CONTRATADA</h2>
          <p>
            Nome: <strong>Anrielly Cristina Costa Gomes</strong><br>
            Profissão: <strong>Mestre de Cerimônia</strong><br>
            CPF: <strong>092.005.807-85</strong><br>
            Endereço: <strong>Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ</strong><br>
            Telefone: <strong>(24) 99268-9947</strong><br>
            E-mail: <strong>contato@anriellygomes.com.br</strong>
          </p>

          <h2>CLÁUSULA 1ª – DO OBJETO</h2>
          <p>
            Prestação de serviços de Mestre de Cerimônia para o evento do(a) CONTRATANTE, no dia 
            <strong>${contract.event_date}</strong>, às <strong>${contract.event_time}</strong>, no local <strong>${contract.event_location}</strong>.
          </p>

          <h2>CLÁUSULA 2ª – DOS SERVIÇOS</h2>
          <p>Serviços inclusos:</p>
          <ul>
            <li>💍 Condução da cerimônia;</li>
            <li>🤝 Recepção dos convidados;</li>
            <li>👰‍♀️🤵‍♂️ Apresentação dos noivos;</li>
            <li>📜 Leitura dos votos;</li>
            <li>💑 Troca de alianças;</li>
            <li>🎤 Pronunciamento dos noivos;</li>
            <li>💖 Declaração oficial do casamento;</li>
            <li>🙏 Agradecimentos finais;</li>
            <li>🎉 Interação com os convidados;</li>
            <li>⏱️ Gerenciamento do tempo e andamento da cerimônia;</li>
            <li>📝 Atender às solicitações específicas do CONTRATANTE.</li>
          </ul>

          <h2>CLÁUSULA 3ª – DO VALOR E PAGAMENTO</h2>
          <p>Valor total: <strong>R$ ${contract.total_price}</strong>.</p>
          <ul>
            <li>Entrada: <strong>R$ ${contract.down_payment}</strong> até <strong>${contract.down_payment_date}</strong>;</li>
            <li>Saldo restante: <strong>R$ ${contract.remaining_amount}</strong> até <strong>${contract.remaining_payment_date}</strong>.</li>
          </ul>

          <h2>CLÁUSULA 4ª – DA RESCISÃO</h2>
          <p>
            Qualquer das partes pode rescindir este contrato com 30 dias de antecedência. 
            Se por parte do CONTRATANTE, multa de <strong>50%</strong> do valor total. 
            Se por parte da CONTRATADA, devolução integral dos valores pagos.
          </p>

          <h2>CLÁUSULA 5ª – DAS DISPOSIÇÕES GERAIS</h2>
          <ul>
            <li>🔒 Sigilo total sobre informações do CONTRATANTE;</li>
            <li>👔 Compromisso com vestimenta adequada e profissional;</li>
            <li>⏰ Chegada ao local com antecedência mínima de 1 hora;</li>
            <li>📑 O CONTRATANTE deve fornecer informações precisas e local adequado para a realização da cerimônia;</li>
            <li>📝 Observações adicionais: ${contract.notes || 'Nenhuma observação registrada.'}</li>
          </ul>

          <h2>CLÁUSULA 6ª – DO FORO</h2>
          <p>Foro da Comarca de Volta Redonda - RJ para dirimir qualquer litígio.</p>

          <h2>CLÁUSULA 7ª – ASSINATURA ELETRÔNICA E VALIDADE JURÍDICA</h2>
          <p>Este contrato é assinado eletronicamente, com validade jurídica, conforme a Lei nº 14.063/2020, o Marco Civil da Internet (Lei nº 12.965/2014) e o Código Civil Brasileiro.</p>
          <p>Dados coletados na assinatura:</p>
          <ul>
            <li><strong>IP:</strong> ${auditData.signer_ip}</li>
            <li><strong>Data e Hora:</strong> ${signedAt}</li>
            <li><strong>Dispositivo:</strong> ${auditData.user_agent}</li>
            <li><strong>Hash do Documento:</strong> ${auditData.document_hash}</li>
          </ul>

          <p>As partes firmam este instrumento, que passa a ter validade legal.</p>

          <div class="signatures">
            <div class="signature-box">
              <p>Local e data: ${contract.event_location}, ${signedAt}</p>
              <p><strong>CONTRATANTE:</strong></p>
              <p>${contract.client_name}</p>
              <div class="signature-image">
                <img src="${clientSignature}" alt="Assinatura do Contratante">
              </div>
            </div>

            <div class="signature-box">
              <p><strong>CONTRATADA:</strong></p>
              <p>Anrielly Cristina Costa Gomes</p>
              <div class="signature-image">
                <img src="/lovable-uploads/assinatura-anrielly.png" alt="Assinatura da Contratada">
              </div>
            </div>
          </div>

          <div class="auth-footer">
            <p><strong>IP:</strong> ${auditData.signer_ip}</p>
            <p><strong>Data:</strong> ${signedAt}</p>
            <p><strong>Dispositivo:</strong> ${auditData.user_agent}</p>
            <p><strong>Hash do Documento:</strong> ${auditData.document_hash}</p>
            <p class="version-info">
              <strong>Versão do Contrato:</strong> ${contract.version} |
              <strong>Data da Versão:</strong> ${contract.version_date}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
