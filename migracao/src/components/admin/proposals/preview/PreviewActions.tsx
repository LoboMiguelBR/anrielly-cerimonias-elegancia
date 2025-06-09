
import React from 'react';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import PDFActions from './PDFActions';

interface PreviewActionsProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onBack: () => void;
  pdfBlob?: Blob | null;
}

const PreviewActions: React.FC<PreviewActionsProps> = (props) => {
  return <PDFActions {...props} />;
};

export default PreviewActions;
