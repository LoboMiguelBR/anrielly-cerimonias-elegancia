
import { ProposalData } from '../../../hooks/proposal/types';
import { ProposalTemplateData } from '../../../hooks/proposal/api/proposalTemplates';

export const generateProposalHtml = (proposal: ProposalData, template?: ProposalTemplateData): string => {
  const html = template?.html_content || `
    <div class="proposal">
      <h1>Proposta para {{client_name}}</h1>
      <p>Email: {{client_email}}</p>
      <p>Telefone: {{client_phone}}</p>
      <p>Evento: {{event_type}}</p>
      <p>Data: {{event_date}}</p>
      <p>Local: {{event_location}}</p>
      <p>Total: R$ {{total_price}}</p>
    </div>
  `;
  
  // Replace variables
  return html
    .replace(/\{\{client_name\}\}/g, proposal.client_name)
    .replace(/\{\{client_email\}\}/g, proposal.client_email)
    .replace(/\{\{client_phone\}\}/g, proposal.client_phone)
    .replace(/\{\{event_type\}\}/g, proposal.event_type)
    .replace(/\{\{event_date\}\}/g, proposal.event_date || '')
    .replace(/\{\{event_location\}\}/g, proposal.event_location)
    .replace(/\{\{total_price\}\}/g, proposal.total_price.toString());
};
