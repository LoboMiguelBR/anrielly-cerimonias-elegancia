
import { ProposalData } from '../../../hooks/proposal/types';

/**
 * Replace template variables with actual proposal data
 */
export const replaceVariablesInTemplate = (htmlContent: string, proposal: ProposalData): string => {
  let processedContent = htmlContent;

  // Client information variables
  processedContent = processedContent.replace(/\{\{client_name\}\}/g, proposal.client_name || '');
  processedContent = processedContent.replace(/\{\{client_email\}\}/g, proposal.client_email || '');
  processedContent = processedContent.replace(/\{\{client_phone\}\}/g, proposal.client_phone || '');

  // Event information variables
  processedContent = processedContent.replace(/\{\{event_type\}\}/g, proposal.event_type || '');
  processedContent = processedContent.replace(/\{\{event_date\}\}/g, 
    proposal.event_date ? new Date(proposal.event_date).toLocaleDateString('pt-BR') : ''
  );
  processedContent = processedContent.replace(/\{\{event_location\}\}/g, proposal.event_location || '');

  // Financial variables
  processedContent = processedContent.replace(/\{\{total_price\}\}/g, 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.total_price || 0)
  );
  
  // Terms and conditions
  processedContent = processedContent.replace(/\{\{payment_terms\}\}/g, proposal.payment_terms || '');
  processedContent = processedContent.replace(/\{\{validity_date\}\}/g, 
    proposal.validity_date ? new Date(proposal.validity_date).toLocaleDateString('pt-BR') : ''
  );
  
  // Notes
  processedContent = processedContent.replace(/\{\{notes\}\}/g, proposal.notes || '');

  // Services list
  const servicesHtml = proposal.services
    .filter(service => service.included)
    .map(service => `
      <div class="service-item">
        <h4>${service.name}</h4>
        ${service.description ? `<p>${service.description}</p>` : ''}
      </div>
    `).join('');
  
  processedContent = processedContent.replace(/\{\{services\}\}/g, servicesHtml);

  // Current date
  processedContent = processedContent.replace(/\{\{current_date\}\}/g, 
    new Date().toLocaleDateString('pt-BR')
  );

  return processedContent;
};

/**
 * Get all available variables for templates
 */
export const getAvailableVariables = () => {
  return [
    { name: 'client_name', description: 'Nome do cliente', category: 'Cliente' },
    { name: 'client_email', description: 'Email do cliente', category: 'Cliente' },
    { name: 'client_phone', description: 'Telefone do cliente', category: 'Cliente' },
    { name: 'event_type', description: 'Tipo do evento', category: 'Evento' },
    { name: 'event_date', description: 'Data do evento', category: 'Evento' },
    { name: 'event_location', description: 'Local do evento', category: 'Evento' },
    { name: 'total_price', description: 'Valor total da proposta', category: 'Financeiro' },
    { name: 'payment_terms', description: 'Condições de pagamento', category: 'Financeiro' },
    { name: 'validity_date', description: 'Data de validade', category: 'Financeiro' },
    { name: 'services', description: 'Lista de serviços incluídos', category: 'Serviços' },
    { name: 'notes', description: 'Observações gerais', category: 'Outros' },
    { name: 'current_date', description: 'Data atual', category: 'Outros' }
  ];
};
