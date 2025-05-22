
import { VariableInsertionResult, TemplateVariable } from './types';
import { ProposalData } from '../../../hooks/proposal';
import { supabase } from '@/integrations/supabase/client';

// Define available variables for templates
export const defaultTemplateVariables: TemplateVariable[] = [
  // Client information variables
  { name: 'name', category: 'client', description: 'Nome do cliente', sampleValue: 'João Silva' },
  { name: 'email', category: 'client', description: 'Email do cliente', sampleValue: 'joao@example.com' },
  { name: 'phone', category: 'client', description: 'Telefone do cliente', sampleValue: '(11) 98765-4321' },
  
  // Event variables
  { name: 'type', category: 'event', description: 'Tipo de evento', sampleValue: 'Casamento' },
  { name: 'date', category: 'event', description: 'Data do evento', sampleValue: '12/06/2024' },
  { name: 'location', category: 'event', description: 'Local do evento', sampleValue: 'Sítio das Flores, São Paulo' },
  
  // Company variables
  { name: 'name', category: 'company', description: 'Nome da empresa', sampleValue: 'Anrielly Gomes Fotografia' },
  { name: 'logo', category: 'company', description: 'Logo da empresa (HTML img tag)', sampleValue: '<img src="/LogoAG.png" alt="Logo">' },
  { name: 'about', category: 'company', description: 'Texto sobre a empresa', sampleValue: 'Fotógrafa profissional especializada em capturar momentos especiais.' },
  { name: 'contact', category: 'company', description: 'Contatos da empresa', sampleValue: 'contato@anriellygomes.com.br | (11) 99999-9999' },
  
  // Pricing variables
  { name: 'details', category: 'pricing', description: 'Detalhes do preço', sampleValue: 'Pacote básico: R$ 1.500,00<br>Álbum fotográfico: R$ 500,00' },
  { name: 'total', category: 'pricing', description: 'Valor total', sampleValue: 'R$ 2.000,00' },
  
  // Services variables
  { name: 'list', category: 'services', description: 'Lista de serviços', sampleValue: '<ul><li>6 horas de cobertura</li><li>100 fotos editadas</li><li>Álbum digital</li></ul>' },
  
  // Testimonials variables
  { name: 'recent1', category: 'testimonials', description: 'Depoimento recente 1', sampleValue: '"Simplesmente amei as fotos do meu casamento!" - Maria' },
  { name: 'recent2', category: 'testimonials', description: 'Depoimento recente 2', sampleValue: '"Captou momentos incríveis da minha família." - Pedro' },
  
  // QR Code variables
  { name: 'website', category: 'qrcode', description: 'QR Code para o site', sampleValue: '[QR Code HTML]' },
  { name: 'whatsapp', category: 'qrcode', description: 'QR Code para WhatsApp', sampleValue: '[QR Code HTML]' },
  
  // Proposal variables
  { name: 'validity_date', category: 'proposal', description: 'Data de validade da proposta', sampleValue: '30/07/2024' }
];

// Insert a variable or custom text at the cursor position
export function insertVariableAtCursor(
  content: string, 
  cursorPosition: number, 
  category: string,
  variable: string,
  customText?: string
): VariableInsertionResult {
  let textToInsert = customText;
  
  // If no custom text is provided, use the variable format
  if (!customText && category && variable) {
    textToInsert = `{{${category}.${variable}}}`;
  } else if (!customText) {
    textToInsert = '';
  }
  
  const updatedContent = 
    content.substring(0, cursorPosition) + 
    textToInsert + 
    content.substring(cursorPosition);
  
  const newCursorPosition = cursorPosition + (textToInsert?.length || 0);
  
  return {
    updatedContent,
    cursorPosition: newCursorPosition
  };
}

// Replace variables in content with actual values from a proposal
export function replaceVariablesInTemplate(
  htmlContent: string,
  proposal: ProposalData
): string {
  let processedContent = htmlContent;
  
  // Replace client variables
  processedContent = processedContent
    .replace(/{{client.name}}/g, proposal.client_name || '')
    .replace(/{{client.email}}/g, proposal.client_email || '')
    .replace(/{{client.phone}}/g, proposal.client_phone || '');
  
  // Replace event variables
  const eventDate = proposal.event_date ? new Date(proposal.event_date).toLocaleDateString('pt-BR') : '';
  processedContent = processedContent
    .replace(/{{event.type}}/g, proposal.event_type || '')
    .replace(/{{event.date}}/g, eventDate)
    .replace(/{{event.location}}/g, proposal.event_location || '');
  
  // Replace pricing variables
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(proposal.total_price);
  
  const servicesHtml = proposal.services
    .filter(service => service.included)
    .map(service => `<li>${service.name}</li>`)
    .join('');
    
  processedContent = processedContent
    .replace(/{{pricing.details}}/g, proposal.payment_terms || '')
    .replace(/{{pricing.total}}/g, formattedPrice)
    .replace(/{{services.list}}/g, `<ul>${servicesHtml}</ul>`)
    .replace(/{{proposal.validity_date}}/g, proposal.validity_date ? 
      new Date(proposal.validity_date).toLocaleDateString('pt-BR') : '');
      
  // For now, use static company details - these could come from app settings in the future
  processedContent = processedContent
    .replace(/{{company.name}}/g, 'Anrielly Gomes Fotografia')
    .replace(/{{company.logo}}/g, '<img src="https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png" alt="Logo" style="max-width: 200px;">')
    .replace(/{{company.contact}}/g, 'contato@anriellygomes.com.br');

  // To be implemented in next phase - fetch and replace testimonials
  
  return processedContent;
}

// Fetch recent testimonials for the template
export async function fetchRecentTestimonials(limit: number = 2): Promise<Array<{name: string, quote: string}>> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('name, quote')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent testimonials:', error);
    return [];
  }
}

// Check if content contains variables and return them
export function extractVariablesFromContent(content: string): string[] {
  const variableRegex = /{{([^}]+)}}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    variables.push(match[1]);
  }
  
  return variables;
}

// Get the variable type and name from a variable string like "client.name"
export function parseVariableString(variableString: string): { category: string, name: string } | null {
  const parts = variableString.trim().split('.');
  if (parts.length !== 2) return null;
  
  return {
    category: parts[0],
    name: parts[1]
  };
}
