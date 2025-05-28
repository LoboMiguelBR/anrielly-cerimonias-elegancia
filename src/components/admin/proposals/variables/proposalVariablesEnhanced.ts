
import { ProposalData } from '../../hooks/proposal/types';

export const getProposalVariables = (proposal: ProposalData) => {
  // Calculate services table HTML
  const servicesHtml = proposal.services && proposal.services.length > 0 
    ? proposal.services
        .filter(service => service.included)
        .map(service => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${service.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${service.description || ''}</td>
          </tr>
        `).join('')
    : '<tr><td colspan="2" style="padding: 8px; text-align: center; color: #666;">Nenhum serviço selecionado</td></tr>';

  const servicesTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Serviço</th>
          <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600;">Descrição</th>
        </tr>
      </thead>
      <tbody>
        ${servicesHtml}
      </tbody>
    </table>
  `;

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  // Format currency
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue || 0);
  };

  return {
    '{{client_name}}': proposal.client_name || '',
    '{{client_email}}': proposal.client_email || '',
    '{{client_phone}}': proposal.client_phone || '',
    '{{event_type}}': proposal.event_type || '',
    '{{event_date}}': formatDate(proposal.event_date),
    '{{event_date_raw}}': proposal.event_date || '',
    '{{event_location}}': proposal.event_location || '',
    '{{total_price}}': formatCurrency(proposal.total_price),
    '{{total_price_raw}}': proposal.total_price?.toString() || '0',
    '{{validity_date}}': formatDate(proposal.validity_date),
    '{{validity_date_raw}}': proposal.validity_date || '',
    '{{payment_terms}}': proposal.payment_terms || '',
    '{{notes}}': proposal.notes || '',
    '{{services}}': proposal.services ? JSON.stringify(proposal.services) : '[]',
    '{{services_table}}': servicesTable,
    '{{services_count}}': proposal.services ? proposal.services.filter(s => s.included).length.toString() : '0',
    '{{proposal_id}}': proposal.id || '',
    '{{status}}': proposal.status || 'draft'
  };
};

export const getProposalVariablesGrouped = () => {
  return [
    {
      category: 'client',
      label: 'Dados do Cliente',
      variables: [
        { key: 'client_name', label: 'Nome do Cliente', variable: '{{client_name}}' },
        { key: 'client_email', label: 'Email do Cliente', variable: '{{client_email}}' },
        { key: 'client_phone', label: 'Telefone do Cliente', variable: '{{client_phone}}' }
      ]
    },
    {
      category: 'event',
      label: 'Dados do Evento',
      variables: [
        { key: 'event_type', label: 'Tipo do Evento', variable: '{{event_type}}' },
        { key: 'event_date', label: 'Data do Evento (Formatada)', variable: '{{event_date}}' },
        { key: 'event_date_raw', label: 'Data do Evento (Texto)', variable: '{{event_date_raw}}' },
        { key: 'event_location', label: 'Local do Evento', variable: '{{event_location}}' }
      ]
    },
    {
      category: 'financial',
      label: 'Dados Financeiros',
      variables: [
        { key: 'total_price', label: 'Preço Total (Formatado)', variable: '{{total_price}}' },
        { key: 'total_price_raw', label: 'Preço Total (Número)', variable: '{{total_price_raw}}' },
        { key: 'payment_terms', label: 'Condições de Pagamento', variable: '{{payment_terms}}' },
        { key: 'validity_date', label: 'Data de Validade (Formatada)', variable: '{{validity_date}}' },
        { key: 'validity_date_raw', label: 'Data de Validade (Texto)', variable: '{{validity_date_raw}}' }
      ]
    },
    {
      category: 'services',
      label: 'Serviços',
      variables: [
        { key: 'services_table', label: 'Tabela de Serviços (HTML)', variable: '{{services_table}}' },
        { key: 'services_count', label: 'Quantidade de Serviços', variable: '{{services_count}}' },
        { key: 'services', label: 'Serviços (JSON)', variable: '{{services}}' }
      ]
    },
    {
      category: 'additional',
      label: 'Informações Adicionais',
      variables: [
        { key: 'notes', label: 'Observações', variable: '{{notes}}' },
        { key: 'proposal_id', label: 'ID da Proposta', variable: '{{proposal_id}}' },
        { key: 'status', label: 'Status da Proposta', variable: '{{status}}' }
      ]
    }
  ];
};

export const replaceVariables = (content: string, proposal: ProposalData): string => {
  const variables = getProposalVariables(proposal);
  
  let result = content;
  Object.entries(variables).forEach(([variable, value]) => {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return result;
};
