
export const generateBasicProposalTemplate = () => {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Proposta - {{client.name}}</title>
</head>
<body>
    <div class="proposal-container">
        <!-- Cabeçalho -->
        <header class="header">
            <div class="company-info">
                <h1>{{company.name}}</h1>
                <p>{{company.contact_email}} | {{company.contact_phone}}</p>
                <p>{{company.website}}</p>
            </div>
            <div class="proposal-info">
                <h2>PROPOSTA COMERCIAL</h2>
                <p><strong>Proposta:</strong> {{proposal.id}}</p>
                <p><strong>Data:</strong> {{proposal.created_date_formatted}}</p>
                <p><strong>Validade:</strong> {{financial.validity_date_formatted}}</p>
            </div>
        </header>

        <!-- Dados do Cliente -->
        <section class="client-section">
            <h3>DADOS DO CLIENTE</h3>
            <div class="client-info">
                <p><strong>Nome:</strong> {{client.name}}</p>
                <p><strong>Email:</strong> {{client.email}}</p>
                <p><strong>Telefone:</strong> {{client.phone}}</p>
            </div>
        </section>

        <!-- Dados do Evento -->
        <section class="event-section">
            <h3>DADOS DO EVENTO</h3>
            <div class="event-info">
                <p><strong>Tipo:</strong> {{event.type}}</p>
                <p><strong>Data:</strong> {{event.date_formatted}}</p>
                <p><strong>Local:</strong> {{event.location}}</p>
            </div>
        </section>

        <!-- Serviços -->
        <section class="services-section">
            <h3>SERVIÇOS INCLUSOS</h3>
            <div class="services-list">
                <pre>{{services.list_formatted}}</pre>
            </div>
            <div class="total-price">
                <p><strong>VALOR TOTAL: {{services.total_price_formatted}}</strong></p>
            </div>
        </section>

        <!-- Condições de Pagamento -->
        <section class="payment-section">
            <h3>CONDIÇÕES DE PAGAMENTO</h3>
            <p>{{financial.payment_terms}}</p>
        </section>

        <!-- Observações -->
        <section class="notes-section">
            <h3>OBSERVAÇÕES</h3>
            <p>{{proposal.notes}}</p>
        </section>

        <!-- Rodapé -->
        <footer class="footer">
            <p>Esta proposta é válida até {{financial.validity_date_formatted}}</p>
            <p>{{company.name}} - {{company.contact_email}} - {{company.contact_phone}}</p>
        </footer>
    </div>
</body>
</html>`;

  const css = `.proposal-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e91e63;
}

.company-info h1 {
    color: #e91e63;
    margin: 0;
    font-size: 24px;
}

.company-info p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
}

.proposal-info {
    text-align: right;
}

.proposal-info h2 {
    color: #e91e63;
    margin: 0 0 10px 0;
    font-size: 20px;
}

.proposal-info p {
    margin: 2px 0;
    font-size: 14px;
}

section {
    margin-bottom: 30px;
}

h3 {
    color: #e91e63;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.client-info, .event-info {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
}

.services-list {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 15px;
}

.services-list pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: Arial, sans-serif;
}

.total-price {
    text-align: right;
    font-size: 18px;
    color: #e91e63;
}

.footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    text-align: center;
    color: #666;
    font-size: 12px;
}

@media print {
    .proposal-container {
        padding: 20px;
    }
}`;

  return { html, css };
};
