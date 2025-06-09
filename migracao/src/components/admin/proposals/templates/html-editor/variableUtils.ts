import { ProposalData } from '../../../hooks/proposal/types';
import { 
  fetchGalleryForTemplate, 
  fetchTestimonialsForTemplate, 
  generateGalleryHtml, 
  generateTestimonialsHtml,
  DynamicDataOptions 
} from './services/dynamicDataService';

/**
 * Parse variable options from template variable syntax
 * Example: {{gallery_images:6:grid:3}} -> { limit: 6, layout: 'grid', columns: 3 }
 */
const parseVariableOptions = (variable: string): DynamicDataOptions => {
  const parts = variable.split(':');
  const options: DynamicDataOptions = {};
  
  if (parts.length > 1) {
    // First option is usually limit
    const limit = parseInt(parts[1]);
    if (!isNaN(limit)) options.limit = limit;
    
    // Second option is layout
    if (parts[2] && ['grid', 'carousel', 'list'].includes(parts[2])) {
      options.layout = parts[2] as 'grid' | 'carousel' | 'list';
    }
    
    // Third option is columns (for grid layout)
    if (parts[3]) {
      const columns = parseInt(parts[3]);
      if (!isNaN(columns)) options.columns = columns;
    }
  }
  
  return options;
};

/**
 * Replace template variables with actual proposal data (including dynamic variables)
 */
export const replaceVariablesInTemplate = async (htmlContent: string, proposal: ProposalData): Promise<string> => {
  let processedContent = htmlContent;

  // Static variables (existing functionality)
  processedContent = processedContent.replace(/\{\{client_name\}\}/g, proposal.client_name || '');
  processedContent = processedContent.replace(/\{\{client_email\}\}/g, proposal.client_email || '');
  processedContent = processedContent.replace(/\{\{client_phone\}\}/g, proposal.client_phone || '');
  processedContent = processedContent.replace(/\{\{event_type\}\}/g, proposal.event_type || '');
  processedContent = processedContent.replace(/\{\{event_date\}\}/g, 
    proposal.event_date ? new Date(proposal.event_date).toLocaleDateString('pt-BR') : ''
  );
  processedContent = processedContent.replace(/\{\{event_location\}\}/g, proposal.event_location || '');
  processedContent = processedContent.replace(/\{\{total_price\}\}/g, 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.total_price || 0)
  );
  processedContent = processedContent.replace(/\{\{payment_terms\}\}/g, proposal.payment_terms || '');
  processedContent = processedContent.replace(/\{\{validity_date\}\}/g, 
    proposal.validity_date ? new Date(proposal.validity_date).toLocaleDateString('pt-BR') : ''
  );
  processedContent = processedContent.replace(/\{\{notes\}\}/g, proposal.notes || '');
  processedContent = processedContent.replace(/\{\{current_date\}\}/g, 
    new Date().toLocaleDateString('pt-BR')
  );

  // Services list (existing)
  const servicesHtml = proposal.services
    .filter(service => service.included)
    .map(service => `
      <div class="service-item">
        <h4>${service.name}</h4>
        ${service.description ? `<p>${service.description}</p>` : ''}
      </div>
    `).join('');
  
  processedContent = processedContent.replace(/\{\{services\}\}/g, servicesHtml);

  // Dynamic gallery variables
  const galleryMatches = processedContent.match(/\{\{gallery_images[^}]*\}\}/g);
  if (galleryMatches) {
    for (const match of galleryMatches) {
      const options = parseVariableOptions(match.slice(2, -2)); // Remove {{ }}
      const images = await fetchGalleryForTemplate(options);
      const galleryHtml = generateGalleryHtml(images, options);
      processedContent = processedContent.replace(match, galleryHtml);
    }
  }

  // Dynamic testimonials variables
  const testimonialsMatches = processedContent.match(/\{\{testimonials[^}]*\}\}/g);
  if (testimonialsMatches) {
    for (const match of testimonialsMatches) {
      const options = parseVariableOptions(match.slice(2, -2)); // Remove {{ }}
      const testimonials = await fetchTestimonialsForTemplate(options);
      const testimonialsHtml = generateTestimonialsHtml(testimonials, options);
      processedContent = processedContent.replace(match, testimonialsHtml);
    }
  }

  return processedContent;
};

/**
 * Get all available variables for templates (including dynamic ones)
 */
export const getAvailableVariables = () => {
  return [
    // Client variables
    { name: 'client_name', description: 'Nome do cliente', category: 'Cliente' },
    { name: 'client_email', description: 'Email do cliente', category: 'Cliente' },
    { name: 'client_phone', description: 'Telefone do cliente', category: 'Cliente' },
    
    // Event variables
    { name: 'event_type', description: 'Tipo do evento', category: 'Evento' },
    { name: 'event_date', description: 'Data do evento', category: 'Evento' },
    { name: 'event_location', description: 'Local do evento', category: 'Evento' },
    
    // Financial variables
    { name: 'total_price', description: 'Valor total da proposta', category: 'Financeiro' },
    { name: 'payment_terms', description: 'Condições de pagamento', category: 'Financeiro' },
    { name: 'validity_date', description: 'Data de validade', category: 'Financeiro' },
    
    // Services
    { name: 'services', description: 'Lista de serviços incluídos', category: 'Serviços' },
    
    // Gallery variables (NEW)
    { name: 'gallery_images', description: 'Todas as imagens da galeria', category: 'Galeria' },
    { name: 'gallery_images:6', description: 'Primeiras 6 imagens da galeria', category: 'Galeria' },
    { name: 'gallery_images:6:grid:3', description: 'Grid 3 colunas com 6 imagens', category: 'Galeria' },
    { name: 'gallery_images:4:carousel', description: 'Carrossel com 4 imagens', category: 'Galeria' },
    
    // Testimonials variables (NEW)
    { name: 'testimonials', description: 'Todos os depoimentos aprovados', category: 'Depoimentos' },
    { name: 'testimonials:3', description: 'Primeiros 3 depoimentos', category: 'Depoimentos' },
    { name: 'testimonials:2:grid', description: 'Grid com 2 depoimentos', category: 'Depoimentos' },
    { name: 'testimonials:4:carousel', description: 'Carrossel com 4 depoimentos', category: 'Depoimentos' },
    
    // Other variables
    { name: 'notes', description: 'Observações gerais', category: 'Outros' },
    { name: 'current_date', description: 'Data atual', category: 'Outros' }
  ];
};
