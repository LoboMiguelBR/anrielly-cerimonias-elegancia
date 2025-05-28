
import { ProposalData } from "../../hooks/proposal";

/**
 * Helper functions for processing proposal data with strict validation
 */
export const ProposalHelper = {
  /**
   * Ensures proposal data is valid with comprehensive fallbacks for PDF generation
   */
  ensureValidProposal: (proposal: ProposalData): ProposalData => {
    // Ensure services is always a valid array
    const services = Array.isArray(proposal.services) ? proposal.services : [];
    
    // Sanitize services array to ensure each service has required properties
    const sanitizedServices = services.map(service => ({
      name: service?.name || "Serviço não especificado",
      description: service?.description || "",
      price: typeof service?.price === 'number' ? service.price : 0,
      quantity: typeof service?.quantity === 'number' ? service.quantity : 1,
      included: Boolean(service?.included)
    }));

    return {
      ...proposal,
      id: proposal.id || "temp-id",
      client_name: proposal.client_name?.trim() || "Cliente",
      client_email: proposal.client_email?.trim() || "",
      client_phone: proposal.client_phone?.trim() || "",
      event_type: proposal.event_type?.trim() || "Evento",
      event_date: proposal.event_date || null,
      event_location: proposal.event_location?.trim() || "A definir",
      services: sanitizedServices,
      total_price: typeof proposal.total_price === 'number' ? proposal.total_price : 0,
      payment_terms: proposal.payment_terms?.trim() || "A definir",
      notes: proposal.notes?.trim() || "",
      validity_date: proposal.validity_date || new Date().toISOString(),
      created_at: proposal.created_at || new Date().toISOString(),
      template_id: proposal.template_id || null,
      status: proposal.status || 'draft',
      pdf_url: proposal.pdf_url || null,
      html_content: proposal.html_content || null,
      css_content: proposal.css_content || null,
      version: proposal.version || 1,
      version_timestamp: proposal.version_timestamp || new Date().toISOString(),
      public_slug: proposal.public_slug || null,
      public_token: proposal.public_token || ""
    };
  },
  
  /**
   * Format date string for display with safe fallback
   */
  formatDate: (dateString: string | null): string => {
    if (!dateString) return 'A definir';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'A definir';
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'A definir';
    }
  },

  /**
   * Format currency with safe fallback
   */
  formatCurrency: (value: number | null | undefined): string => {
    if (typeof value !== 'number' || isNaN(value)) return '0,00';
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  },

  /**
   * Validate proposal data for PDF generation
   */
  isValidForPDF: (proposal: ProposalData): boolean => {
    return !!(
      proposal &&
      proposal.client_name?.trim() &&
      proposal.event_type?.trim() &&
      Array.isArray(proposal.services) &&
      typeof proposal.total_price === 'number'
    );
  }
};
