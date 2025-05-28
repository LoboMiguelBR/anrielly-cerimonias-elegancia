
import React, { useState, useEffect } from 'react';
import { ProposalData } from '../../hooks/proposal/types';
import { ProposalTemplateData } from '../../hooks/proposal/api/proposalTemplates';
import { replaceVariablesInTemplate } from '../templates/html-editor/variableUtils';

interface ProposalPDFGeneratorProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onPdfReady: (blob: Blob) => void;
  onError: (error: string) => void;
}

const ProposalPDFGenerator: React.FC<ProposalPDFGeneratorProps> = ({
  proposal,
  template,
  onPdfReady,
  onError
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedHtml, setProcessedHtml] = useState<string>('');

  useEffect(() => {
    const processTemplate = async () => {
      if (template && proposal) {
        try {
          // Process template variables asynchronously
          const htmlWithVariables = await replaceVariablesInTemplate(template.html_content, proposal);
          setProcessedHtml(htmlWithVariables);
        } catch (error: any) {
          console.error('Error processing template:', error);
          onError(`Erro ao processar template: ${error.message}`);
        }
      }
    };

    processTemplate();
  }, [template, proposal, onError]);

  const generatePDF = async () => {
    if (!template || !processedHtml) {
      onError('Template ou dados da proposta não disponíveis');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create a complete HTML document with CSS
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .proposal-container {
                max-width: 800px;
                margin: 0 auto;
              }
              .service-item {
                margin-bottom: 10px;
                padding: 10px;
                border-left: 3px solid #8A2BE2;
                background-color: #f8f9fa;
              }
              .service-item h4 {
                margin: 0 0 5px 0;
                color: #8A2BE2;
              }
              .service-item p {
                margin: 0;
                color: #666;
              }
              ${template.css_content || ''}
            </style>
          </head>
          <body>
            <div class="proposal-container">
              ${processedHtml}
            </div>
          </body>
        </html>
      `;

      // For now, create a simple blob with the HTML content
      // In a production environment, you would use a library like Puppeteer or similar
      const blob = new Blob([fullHtml], { type: 'text/html' });
      onPdfReady(blob);
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      onError(`Erro ao gerar PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Gerador de PDF da Proposta</h3>
        <button
          onClick={generatePDF}
          disabled={isGenerating || !template || !processedHtml}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isGenerating ? 'Gerando...' : 'Gerar PDF'}
        </button>
      </div>
      
      {processedHtml && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Preview do Conteúdo:</h4>
          <div 
            className="border rounded p-4 max-h-64 overflow-y-auto bg-gray-50"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </div>
      )}
      
      {!template && (
        <p className="text-red-600 text-sm">Nenhum template selecionado</p>
      )}
    </div>
  );
};

export default ProposalPDFGenerator;
