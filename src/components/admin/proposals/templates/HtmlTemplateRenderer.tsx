
import React, { useState, useEffect } from 'react';
import { ProposalData } from '../../hooks/proposal';
import { HtmlTemplateData } from './html-editor/types';
import { replaceVariablesInTemplate } from './html-editor/variableUtils';
import { Frame, FrameContextConsumer } from 'react-frame-component';

interface HtmlTemplateRendererProps {
  proposal: ProposalData;
  template: HtmlTemplateData;
  scale?: number;
}

const HtmlTemplateRenderer: React.FC<HtmlTemplateRendererProps> = ({ 
  proposal, 
  template, 
  scale = 1 
}) => {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  
  useEffect(() => {
    // Replace variables in the template with actual data
    const html = replaceVariablesInTemplate(template.htmlContent, proposal);
    setProcessedHtml(html);
  }, [proposal, template]);

  // Create a combined HTML document with both HTML and CSS
  const htmlDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${template.cssContent || ''}
        </style>
      </head>
      <body>
        ${processedHtml}
      </body>
    </html>
  `;

  return (
    <div className="html-template-renderer" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <Frame 
        initialContent={htmlDocument}
        style={{ 
          width: '100%', 
          height: '800px', 
          border: 'none'
        }}
        head={
          <style>
            {`
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
            `}
          </style>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      </Frame>
    </div>
  );
};

export default HtmlTemplateRenderer;
