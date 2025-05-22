
import { ProposalData } from '@/components/admin/hooks/proposal';

/**
 * Utility functions for working with proposals in the preview context
 */
export const proposalUtils = {
  /**
   * Checks if a proposal has all required fields filled
   */
  isProposalComplete: (proposal: ProposalData): boolean => {
    return !!(
      proposal && 
      proposal.client_name && 
      proposal.event_type && 
      Array.isArray(proposal.services) &&
      proposal.services.length > 0
    );
  }
};
