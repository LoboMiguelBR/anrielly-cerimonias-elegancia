
import React from 'react';
import SimplifiedPDFGenerator from './SimplifiedPDFGenerator';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';

interface PDFGeneratorProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  onPdfReady?: (blob: Blob) => void;
  onError: (error: string) => void;
  children: (pdfDocument: React.ReactElement | null) => React.ReactNode;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = (props) => {
  // Redireciona para o componente simplificado
  return <SimplifiedPDFGenerator {...props} />;
};

export default PDFGenerator;
