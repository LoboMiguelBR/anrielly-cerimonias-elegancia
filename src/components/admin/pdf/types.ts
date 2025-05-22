
import { ProposalData } from '../hooks/proposal';

export interface PDFTitleProps {
  eventType: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface ClientInfoSectionProps {
  client: ProposalData;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface EventDetailsSectionProps {
  eventType: string;
  eventDate: string;
  eventLocation: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface ServicesSectionProps {
  services: Array<{
    name: string;
    included?: boolean;
    description?: string;
    price?: number;
  }>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface PricingSectionProps {
  totalPrice: number;
  paymentTerms: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface NotesSectionProps {
  notes: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface PDFHeaderProps {
  proposalId: string;
  createdDate: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface PDFFooterProps {
  validUntil: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface CoverPageProps {
  clientName: string;
  eventType: string;
  eventDate: string;
  totalPrice: number;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface QRCodeSectionProps {
  url: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface DifferentialsSectionProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface TestimonialsSectionProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface AboutSectionProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

// Props for the CoverPage component in pages directory
export interface CoverPageComponentProps {
  proposal: ProposalData;
  template: any;
}
