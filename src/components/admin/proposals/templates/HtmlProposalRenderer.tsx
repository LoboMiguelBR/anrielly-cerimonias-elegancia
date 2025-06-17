
import React from 'react';
import ImprovedHtmlRenderer from './ImprovedHtmlRenderer';
import { ProposalData } from '../../hooks/proposal';

interface HtmlProposalRendererProps {
  proposal: ProposalData;
  templateId?: string;
  onPdfReady?: (blob: Blob) => void;
  onError?: (error: string) => void;
  previewOnly?: boolean;
}

const HtmlProposalRenderer: React.FC<HtmlProposalRendererProps> = (props) => {
  // Redireciona para o componente melhorado
  return <ImprovedHtmlRenderer {...props} />;
};

export default HtmlProposalRenderer;
