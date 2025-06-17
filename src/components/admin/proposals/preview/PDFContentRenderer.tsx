
import React, { useState, useEffect, useRef } from 'react';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import HtmlProposalRenderer from '../templates/HtmlProposalRenderer';
import PDFGenerator from './PDFGenerator';

interface PDFContentRendererProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onPdfReady?: (blob: Blob) => void;
  onError?: (error: string) => void;
  previewOnly?: boolean;
}

const PDFContentRenderer: React.FC<PDFContentRendererProps> = ({
  proposal,
  template,
  onPdfReady,
  onError,
  previewOnly = false
}) => {
  const isHtmlTemplate = !!proposal.template_id && proposal.template_id !== 'default';

  if (isHtmlTemplate) {
    return (
      <HtmlProposalRenderer
        proposal={proposal}
        templateId={proposal.template_id}
        onPdfReady={onPdfReady}
        onError={onError}
        previewOnly={previewOnly}
      />
    );
  }

  // For standard PDF templates
  return (
    <PDFGenerator
      proposal={proposal}
      template={template || {
        id: 'default',
        name: 'Template Padrão',
        colors: {
          primary: '#8A2BE2',
          secondary: '#F2AE30',
          accent: '#E57373',
          text: '#333333',
          background: '#FFFFFF'
        },
        fonts: {
          title: 'Playfair Display, serif',
          body: 'Inter, sans-serif'
        },
        logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
        showQrCode: true,
        showTestimonials: true,
        showDifferentials: true,
        showAboutSection: true
      }}
      onPdfReady={onPdfReady}
      onError={onError}
    >
      {(pdfDocument) => (
        previewOnly ? (
          <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
            <div className="p-4 text-center text-gray-600">
              Preview do PDF disponível após geração
            </div>
          </div>
        ) : null
      )}
    </PDFGenerator>
  );
};

export default PDFContentRenderer;
