
import React, { useState, useEffect } from 'react';
import { ProposalData } from '../../hooks/proposal';
import { HtmlTemplateData } from './html-editor/types';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { fetchHtmlTemplateById, getDefaultHtmlTemplate } from './html-editor/htmlTemplateService';
import { replaceVariablesInTemplate } from './html-editor/variableUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface HtmlProposalRendererProps {
  proposal: ProposalData;
  templateId?: string;
  onPdfReady?: (blob: Blob) => void;
  onError?: (error: string) => void;
  previewOnly?: boolean;
}

const HtmlProposalRenderer: React.FC<HtmlProposalRendererProps> = ({ 
  proposal, 
  templateId,
  onPdfReady,
  onError,
  previewOnly = false
}) => {
  const [template, setTemplate] = useState<HtmlTemplateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        let loadedTemplate = null;
        
        // First try to load the specified template
        if (templateId && templateId !== 'default') {
          loadedTemplate = await fetchHtmlTemplateById(templateId);
        }
        
        // If no template is found, get the default template
        if (!loadedTemplate) {
          loadedTemplate = await getDefaultHtmlTemplate();
        }
        
        if (!loadedTemplate) {
          throw new Error('Nenhum template HTML encontrado');
        }
        
        setTemplate(loadedTemplate);
      } catch (error: any) {
        console.error('Error loading HTML template:', error);
        if (onError) {
          onError(error.message || 'Erro ao carregar template HTML');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplate();
  }, [templateId, onError]);

  useEffect(() => {
    if (template && proposal) {
      // Replace variables in the template with actual data
      const html = replaceVariablesInTemplate(template.htmlContent, proposal);
      setProcessedHtml(html);
    }
  }, [template, proposal]);

  useEffect(() => {
    if (!previewOnly && containerRef.current && processedHtml && !isLoading) {
      generatePDF();
    }
  }, [processedHtml, isLoading, previewOnly]);

  const generatePDF = async () => {
    if (!containerRef.current) return;

    try {
      const element = containerRef.current;
      
      // Wait a bit for the HTML to render
      setTimeout(async () => {
        // Create a canvas from the HTML element
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        
        // Create PDF
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        
        // Add new pages if content is longer than one page
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Generate blob
        const pdfBlob = pdf.output('blob');
        
        if (onPdfReady) {
          onPdfReady(pdfBlob);
        }
      }, 1000);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      if (onError) {
        onError(error.message || 'Erro ao gerar PDF');
      }
    }
  };

  // Create a combined HTML document with both HTML and CSS
  const htmlDocument = template ? `
    <style>
      ${template.cssContent || ''}
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
    </style>
    ${processedHtml}
  ` : '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-lg font-semibold text-red-500">
          Nenhum template HTML encontrado
        </h3>
        <p className="text-gray-500">
          Crie um template HTML ou defina um template padrão para visualizar a proposta.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hidden container used for PDF generation */}
      <div 
        ref={containerRef} 
        className={previewOnly ? "" : "hidden"} 
        style={{ 
          width: '793px',  // A4 width in pixels at 96dpi
          margin: '0 auto',
          background: 'white',
        }}
        dangerouslySetInnerHTML={{ __html: htmlDocument }}
      />
      
      {/* Visible preview (only shown if previewOnly is true) */}
      {previewOnly && (
        <div 
          className="border rounded-lg shadow-sm overflow-hidden bg-white"
          style={{ 
            width: '100%', 
            maxWidth: '793px',
            margin: '0 auto',
            height: '600px',
            overflow: 'auto'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: htmlDocument }} />
        </div>
      )}
    </div>
  );
};

export default HtmlProposalRenderer;
