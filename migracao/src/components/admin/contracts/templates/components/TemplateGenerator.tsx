
import { toast } from 'sonner';

export const generateBasicTemplate = () => {
  const basicHtml = `
<div class="contract-document">
  <header class="contract-header">
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p class="contract-subtitle">Cerimonial de {TIPO_EVENTO}</p>
  </header>

  <section class="contract-parties">
    <h2>PARTES CONTRATANTES</h2>
    <div class="party">
      <h3>CONTRATANTE:</h3>
      <p><strong>Nome:</strong> {NOME_CLIENTE}</p>
      <p><strong>Email:</strong> {EMAIL_CLIENTE}</p>
      <p><strong>Telefone:</strong> {TELEFONE_CLIENTE}</p>
    </div>
    
    <div class="party">
      <h3>CONTRATADA:</h3>
      <p><strong>Nome:</strong> Anrielly Gomes - Mestre de Cerimônia</p>
      <p><strong>Telefone:</strong> (24) 99268-9947</p>
      <p><strong>Email:</strong> contato@anriellygomes.com.br</p>
    </div>
  </section>

  <section class="contract-details">
    <h2>DETALHES DO EVENTO</h2>
    <p><strong>Tipo de Evento:</strong> {TIPO_EVENTO}</p>
    <p><strong>Data:</strong> {DATA_EVENTO}</p>
    <p><strong>Local:</strong> {LOCAL_EVENTO}</p>
    <p><strong>Valor Total:</strong> {VALOR_TOTAL}</p>
  </section>

  <section class="contract-terms">
    <h2>TERMOS E CONDIÇÕES</h2>
    <ol>
      <li>A contratada se compromete a prestar os serviços de cerimonial conforme acordado.</li>
      <li>O pagamento será realizado conforme condições especificadas.</li>
      <li>Este contrato possui validade jurídica conforme Lei nº 14.063/2020.</li>
    </ol>
  </section>

  <footer class="contract-footer">
    <p>Data: {DATA_VERSAO} | Versão: {VERSAO}</p>
  </footer>
</div>
  `.trim();

  const basicCss = `
.contract-document {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  color: #333;
}

.contract-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 20px;
}

.contract-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
}

.contract-subtitle {
  color: #d4af37;
  font-size: 16px;
  font-style: italic;
}

.contract-parties, .contract-details, .contract-terms {
  margin-bottom: 25px;
}

.contract-parties h2, .contract-details h2, .contract-terms h2 {
  color: #2c3e50;
  border-bottom: 1px solid #bdc3c7;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 18px;
}

.party {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border-left: 4px solid #d4af37;
}

.party h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

.contract-terms ol {
  padding-left: 20px;
}

.contract-terms li {
  margin-bottom: 10px;
}

.contract-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #bdc3c7;
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .contract-document {
    padding: 15px;
  }
  
  .contract-header h1 {
    font-size: 20px;
  }
  
  .party {
    padding: 10px;
  }
}
  `.trim();

  return { html: basicHtml, css: basicCss };
};
