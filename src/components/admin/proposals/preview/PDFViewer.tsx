
import React from 'react';
import { PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import ProposalPDF from '@/components/admin/ProposalPDF';

interface PDFViewerProps {
  proposal: ProposalData;
  template: ProposalTemplateData;
  pdfDocument: React.ReactElement | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  proposal,
  template,
  pdfDocument
}) => {
  return (
    <div className="h-[800px]">
      <ReactPDFViewer 
        width="100%" 
        height="100%" 
        className="border"
        showToolbar={true}
      >
        {pdfDocument || <ProposalPDF proposal={proposal} template={template} />}
      </ReactPDFViewer>
    </div>
  );
};

export default PDFViewer;
