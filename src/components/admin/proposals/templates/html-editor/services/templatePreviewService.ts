
import { HtmlTemplateData } from '../types';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { replaceVariablesInTemplate } from '../variableUtils';

/**
 * Get a preview of the HTML template with proposal data (async version)
 */
export async function getTemplatePreview(
  htmlTemplate: HtmlTemplateData, 
  proposalData: ProposalData
): Promise<string> {
  try {
    return await replaceVariablesInTemplate(htmlTemplate.htmlContent, proposalData);
  } catch (error) {
    console.error('Error generating template preview:', error);
    return htmlTemplate.htmlContent;
  }
}

/**
 * Synchronous version for backward compatibility (without dynamic variables)
 */
export function getTemplatePreviewSync(
  htmlTemplate: HtmlTemplateData, 
  proposalData: ProposalData
): string {
  try {
    // Simple synchronous variable replacement without dynamic content
    let processedContent = htmlTemplate.htmlContent;

    // Static variables only
    processedContent = processedContent.replace(/\{\{client_name\}\}/g, proposalData.client_name || '');
    processedContent = processedContent.replace(/\{\{client_email\}\}/g, proposalData.client_email || '');
    processedContent = processedContent.replace(/\{\{client_phone\}\}/g, proposalData.client_phone || '');
    processedContent = processedContent.replace(/\{\{event_type\}\}/g, proposalData.event_type || '');
    processedContent = processedContent.replace(/\{\{event_date\}\}/g, 
      proposalData.event_date ? new Date(proposalData.event_date).toLocaleDateString('pt-BR') : ''
    );
    processedContent = processedContent.replace(/\{\{event_location\}\}/g, proposalData.event_location || '');
    processedContent = processedContent.replace(/\{\{total_price\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.total_price || 0)
    );
    processedContent = processedContent.replace(/\{\{payment_terms\}\}/g, proposalData.payment_terms || '');
    processedContent = processedContent.replace(/\{\{validity_date\}\}/g, 
      proposalData.validity_date ? new Date(proposalData.validity_date).toLocaleDateString('pt-BR') : ''
    );
    processedContent = processedContent.replace(/\{\{notes\}\}/g, proposalData.notes || '');
    processedContent = processedContent.replace(/\{\{current_date\}\}/g, 
      new Date().toLocaleDateString('pt-BR')
    );

    // Services list
    const servicesHtml = proposalData.services
      .filter(service => service.included)
      .map(service => `
        <div class="service-item">
          <h4>${service.name}</h4>
          ${service.description ? `<p>${service.description}</p>` : ''}
        </div>
      `).join('');
    
    processedContent = processedContent.replace(/\{\{services\}\}/g, servicesHtml);

    return processedContent;
  } catch (error) {
    console.error('Error generating synchronous template preview:', error);
    return htmlTemplate.htmlContent;
  }
}
