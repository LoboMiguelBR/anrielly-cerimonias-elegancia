
import React, { useState, useEffect, useRef } from 'react';
import { ProposalData } from '../../hooks/proposal';
import { HtmlTemplateData } from './html-editor/types';
import { fetchHtmlTemplateById } from './html-editor/services';
import { replaceVariablesInTemplate } from './html-editor/variableUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface ImprovedHtmlRendererProps {
  proposal: ProposalData;
  templateId?: string;
  onPdfReady?: (blob: Blob) => void;
  onError?: (error: string) => void;
  previewOnly?: boolean;
}

const ImprovedHtmlRenderer: React.FC<ImprovedHtmlRendererProps> = ({ 
  proposal, 
  templateId,
  onPdfReady,
  onError,
  previewOnly = false
}) => {
  const [template, setTemplate] = useState<HtmlTemplateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [isProcessingVariables, setIsProcessingVariables] = useState<boolean>(false);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfGenerationRef = useRef<boolean>(false);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        let loadedTemplate = null;
        
        if (templateId && templateId !== 'default') {
          console.log('Loading HTML template with ID:', templateId);
          loadedTemplate = await fetchHtmlTemplateById(templateId);
          console.log('Loaded template:', loadedTemplate);
        }
        
        if (!loadedTemplate) {
          console.error('No template found with ID:', templateId);
          if (onError) {
            onError('Template HTML não encontrado');
          }
          setIsLoading(false);
          return;
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
      const processTemplate = async () => {
        try {
          setIsProcessingVariables(true);
          console.log('Processing template with proposal data:', proposal);
          
          const html = await replaceVariablesInTemplate(template.htmlContent, proposal);
          setProcessedHtml(html);
        } catch (error) {
          console.error('Error processing template:', error);
          if (onError) {
            onError('Erro ao processar template HTML com variáveis dinâmicas');
          }
        } finally {
          setIsProcessingVariables(false);
        }
      };
      
      processTemplate();
    }
  }, [template, proposal, onError]);

  // Observa quando o conteúdo dinâmico terminou de carregar
  useEffect(() => {
    if (!processedHtml || isProcessingVariables) return;

    const checkContentLoaded = () => {
      if (!containerRef.current) return false;

      const images = containerRef.current.querySelectorAll('img');
      const allImagesLoaded = Array.from(images).every(img => img.complete && img.naturalHeight !== 0);
      
      // Verifica se há placeholders sendo substituídos por conteúdo real
      const hasPlaceholders = containerRef.current.innerHTML.includes('Carregando') || 
                             containerRef.current.innerHTML.includes('loading') ||
                             containerRef.current.innerHTML.includes('placeholder');
      
      return allImagesLoaded && !hasPlaceholders;
    };

    const observer = new MutationObserver(() => {
      if (checkContentLoaded()) {
        setContentLoaded(true);
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Timeout de segurança
      setTimeout(() => {
        if (!contentLoaded) {
          console.log('Content loading timeout, proceeding anyway');
          setContentLoaded(true);
        }
        observer.disconnect();
      }, 5000);
    }

    return () => observer.disconnect();
  }, [processedHtml, isProcessingVariables, contentLoaded]);

  // Gera PDF quando o conteúdo estiver pronto
  useEffect(() => {
    if (!previewOnly && 
        contentLoaded && 
        containerRef.current && 
        processedHtml && 
        !isLoading && 
        !isProcessingVariables &&
        !pdfGenerationRef.current) {
      
      pdfGenerationRef.current = true;
      console.log('Content is ready, generating PDF...');
      generatePDF();
    }
  }, [contentLoaded, processedHtml, isLoading, previewOnly, isProcessingVariables]);

  const generatePDF = async () => {
    if (!containerRef.current) {
      console.error('Container ref is null, cannot generate PDF');
      return;
    }

    try {
      const element = containerRef.current;
      
      console.log('Starting PDF generation from HTML element');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      console.log('Canvas generated successfully');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const pdfBlob = pdf.output('blob');
      console.log('PDF blob generated successfully');
      
      if (onPdfReady) {
        console.log('Calling onPdfReady with blob');
        onPdfReady(pdfBlob);
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      pdfGenerationRef.current = false;
      if (onError) {
        onError(`Erro ao gerar PDF: ${error.message || 'Erro desconhecido'}`);
      }
    }
  };

  const htmlDocument = template ? `
    <style>
      ${template.cssContent || ''}
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: white;
      }
      
      .gallery-container {
        margin: 20px 0;
      }
      
      .gallery-item img {
        max-width: 100%;
        height: auto;
      }
      
      .testimonials-container {
        margin: 20px 0;
      }
      
      .testimonial-item {
        border-left: 4px solid #8A2BE2;
      }
      
      .gallery-placeholder,
      .testimonials-placeholder {
        padding: 20px;
        text-align: center;
        color: #666;
        font-style: italic;
        background-color: #f9f9f9;
        border-radius: 8px;
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

  if (isProcessingVariables) {
    return (
      <div className="flex justify-center items-center p-10 h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Processando conteúdo dinâmico...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-lg font-semibold text-red-500">
          Template HTML não encontrado
        </h3>
        <p className="text-gray-500">
          Crie um template HTML ou defina um template padrão para visualizar a proposta.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Container usado para geração de PDF e preview */}
      <div 
        ref={containerRef} 
        className={previewOnly ? "border rounded-lg shadow-sm overflow-hidden bg-white" : "hidden"} 
        style={{ 
          width: previewOnly ? '100%' : '793px',
          maxWidth: previewOnly ? '793px' : undefined,
          margin: '0 auto',
          background: 'white',
          height: previewOnly ? '600px' : undefined,
          overflow: previewOnly ? 'auto' : 'visible'
        }}
        dangerouslySetInnerHTML={{ __html: htmlDocument }}
      />
      
      {!previewOnly && !contentLoaded && (
        <div className="flex justify-center items-center p-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Aguardando conteúdo carregar...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedHtmlRenderer;
