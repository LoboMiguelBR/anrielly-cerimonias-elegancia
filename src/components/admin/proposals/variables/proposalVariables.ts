
import { ProposalData } from '../hooks/proposal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define available proposal variables (mirroring contract variables structure)
export const proposalVariables = {
  client: {
    name: 'Nome do Cliente',
    email: 'Email do Cliente',
    phone: 'Telefone do Cliente'
  },
  event: {
    type: 'Tipo do Evento',
    date: 'Data do Evento',
    date_formatted: 'Data do Evento (Formatada)',
    location: 'Local do Evento',
    time: 'Horário do Evento'
  },
  services: {
    list: 'Lista de Serviços',
    list_formatted: 'Lista de Serviços (Formatada)',
    total_price: 'Preço Total',
    total_price_formatted: 'Preço Total (Formatado)'
  },
  financial: {
    payment_terms: 'Condições de Pagamento',
    validity_date: 'Data de Validade',
    validity_date_formatted: 'Data de Validade (Formatada)'
  },
  company: {
    name: 'Nome da Empresa',
    contact_email: 'Email de Contato',
    contact_phone: 'Telefone de Contato',
    website: 'Site da Empresa'
  },
  proposal: {
    id: 'ID da Proposta',
    created_date: 'Data de Criação',
    created_date_formatted: 'Data de Criação (Formatada)',
    status: 'Status da Proposta',
    notes: 'Observações'
  }
};

// Function to replace variables in template content
export const replaceProposalVariables = (content: string, proposal: ProposalData): string => {
  let processedContent = content;

  // Company data (static information)
  const companyData = {
    name: 'Anrielly Gomes - Mestre de Cerimônia',
    contact_email: 'contato@anriellygomes.com.br',
    contact_phone: '(24) 99268-9947',
    website: 'www.anriellygomes.com.br'
  };

  // Helper function to format currency
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  // Helper function to format services list
  const formatServicesList = (services: any[]): string => {
    if (!services || services.length === 0) return '';
    
    return services.map((service, index) => {
      const price = service.price ? formatCurrency(service.price) : '';
      return `${index + 1}. ${service.name}${price ? ` - ${price}` : ''}`;
    }).join('\n');
  };

  // Replace client variables
  processedContent = processedContent.replace(/\{\{client\.name\}\}/g, proposal.client_name || '');
  processedContent = processedContent.replace(/\{\{client\.email\}\}/g, proposal.client_email || '');
  processedContent = processedContent.replace(/\{\{client\.phone\}\}/g, proposal.client_phone || '');

  // Replace event variables
  processedContent = processedContent.replace(/\{\{event\.type\}\}/g, proposal.event_type || '');
  processedContent = processedContent.replace(/\{\{event\.date\}\}/g, proposal.event_date || '');
  processedContent = processedContent.replace(/\{\{event\.date_formatted\}\}/g, formatDate(proposal.event_date));
  processedContent = processedContent.replace(/\{\{event\.location\}\}/g, proposal.event_location || '');

  // Replace services variables
  const servicesList = Array.isArray(proposal.services) ? proposal.services : [];
  processedContent = processedContent.replace(/\{\{services\.list\}\}/g, servicesList.map(s => s.name).join(', '));
  processedContent = processedContent.replace(/\{\{services\.list_formatted\}\}/g, formatServicesList(servicesList));
  processedContent = processedContent.replace(/\{\{services\.total_price\}\}/g, proposal.total_price?.toString() || '0');
  processedContent = processedContent.replace(/\{\{services\.total_price_formatted\}\}/g, formatCurrency(proposal.total_price || 0));

  // Replace financial variables
  processedContent = processedContent.replace(/\{\{financial\.payment_terms\}\}/g, proposal.payment_terms || '');
  processedContent = processedContent.replace(/\{\{financial\.validity_date\}\}/g, proposal.validity_date || '');
  processedContent = processedContent.replace(/\{\{financial\.validity_date_formatted\}\}/g, formatDate(proposal.validity_date));

  // Replace company variables
  processedContent = processedContent.replace(/\{\{company\.name\}\}/g, companyData.name);
  processedContent = processedContent.replace(/\{\{company\.contact_email\}\}/g, companyData.contact_email);
  processedContent = processedContent.replace(/\{\{company\.contact_phone\}\}/g, companyData.contact_phone);
  processedContent = processedContent.replace(/\{\{company\.website\}\}/g, companyData.website);

  // Replace proposal variables
  processedContent = processedContent.replace(/\{\{proposal\.id\}\}/g, proposal.id || '');
  processedContent = processedContent.replace(/\{\{proposal\.created_date\}\}/g, proposal.created_at || '');
  processedContent = processedContent.replace(/\{\{proposal\.created_date_formatted\}\}/g, formatDate(proposal.created_at));
  processedContent = processedContent.replace(/\{\{proposal\.status\}\}/g, proposal.status || 'draft');
  processedContent = processedContent.replace(/\{\{proposal\.notes\}\}/g, proposal.notes || '');

  return processedContent;
};

// Function to get all available variables grouped by category
export const getProposalVariablesGrouped = () => {
  return Object.entries(proposalVariables).map(([category, variables]) => ({
    category,
    label: getCategoryLabel(category),
    variables: Object.entries(variables).map(([key, label]) => ({
      key,
      label,
      variable: `{{${category}.${key}}}`
    }))
  }));
};

// Helper function to get category labels
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    client: 'Cliente',
    event: 'Evento',
    services: 'Serviços',
    financial: 'Financeiro',
    company: 'Empresa',
    proposal: 'Proposta'
  };
  return labels[category] || category;
};
