
import { ProposalData } from '../hooks/proposal/types';

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

export const replaceVariables = (content: string, proposal: ProposalData): string => {
  const variables = getProposalVariables(proposal);
  
  let result = content;
  Object.entries(variables).forEach(([variable, value]) => {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return result;
};
