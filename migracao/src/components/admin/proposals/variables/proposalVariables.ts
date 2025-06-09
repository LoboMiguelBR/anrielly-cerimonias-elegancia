
import { ProposalData } from '../../hooks/proposal/types';

export const getProposalVariables = (proposal: ProposalData) => {
  return {
    '{{client_name}}': proposal.client_name || '',
    '{{client_email}}': proposal.client_email || '',
    '{{client_phone}}': proposal.client_phone || '',
    '{{event_type}}': proposal.event_type || '',
    '{{event_date}}': proposal.event_date || '',
    '{{event_location}}': proposal.event_location || '',
    '{{total_price}}': proposal.total_price?.toString() || '0',
    '{{validity_date}}': proposal.validity_date || '',
    '{{payment_terms}}': proposal.payment_terms || '',
    '{{notes}}': proposal.notes || '',
    '{{services}}': proposal.services ? JSON.stringify(proposal.services) : '[]'
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
        { key: 'event_date', label: 'Data do Evento', variable: '{{event_date}}' },
        { key: 'event_location', label: 'Local do Evento', variable: '{{event_location}}' }
      ]
    },
    {
      category: 'financial',
      label: 'Dados Financeiros',
      variables: [
        { key: 'total_price', label: 'Preço Total', variable: '{{total_price}}' },
        { key: 'payment_terms', label: 'Condições de Pagamento', variable: '{{payment_terms}}' },
        { key: 'validity_date', label: 'Data de Validade', variable: '{{validity_date}}' }
      ]
    },
    {
      category: 'additional',
      label: 'Informações Adicionais',
      variables: [
        { key: 'notes', label: 'Observações', variable: '{{notes}}' },
        { key: 'services', label: 'Serviços', variable: '{{services}}' }
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
