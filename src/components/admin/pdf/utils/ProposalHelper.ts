
import { ProposalData } from "../../hooks/proposal";

/**
 * Helper functions for processing proposal data
 */
export const ProposalHelper = {
  /**
   * Ensures proposal data is valid with fallbacks for missing data
   */
  ensureValidProposal: (proposal: ProposalData): ProposalData => {
    return {
      ...proposal,
      client_name: proposal.client_name || "Cliente",
      client_email: proposal.client_email || "",
      client_phone: proposal.client_phone || "",
      event_type: proposal.event_type || "Evento",
      event_location: proposal.event_location || "A definir",
      services: Array.isArray(proposal.services) ? proposal.services : [],
      total_price: proposal.total_price || 0,
      payment_terms: proposal.payment_terms || "",
      notes: proposal.notes || "",
      validity_date: proposal.validity_date || new Date().toISOString(),
    };
  },
  
  /**
   * Format date string for display
   */
  formatDate: (dateString: string | null): string => {
    if (!dateString) return 'A definir';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'A definir';
    }
  }
};
