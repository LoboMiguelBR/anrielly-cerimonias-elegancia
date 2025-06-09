
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface TemplatePreviewProps {
  htmlContent: string;
  cssContent?: string;
  variables?: Record<string, any>;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  htmlContent, 
  cssContent = '', 
  variables = {}
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Apply the HTML and CSS content to the iframe
  useEffect(() => {
    const updateIframeContent = () => {
      if (iframeRef.current) {
        const iframeDocument = iframeRef.current.contentDocument || 
                              (iframeRef.current.contentWindow?.document);

        if (iframeDocument) {
          // Create a complete HTML document with the CSS in a style tag
          iframeDocument.open();
          iframeDocument.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Template Preview</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                  }
                  
                  /* User CSS */
                  ${cssContent}
                </style>
              </head>
              <body>
                ${htmlContent}
              </body>
            </html>
          `);
          iframeDocument.close();
        }
      }
    };

    updateIframeContent();
  }, [htmlContent, cssContent, variables]);

  return (
    <Card className="template-preview w-full">
      <div className="p-0 w-full h-[600px] overflow-auto">
        <iframe 
          ref={iframeRef}
          title="Template Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </Card>
  );
};

export default TemplatePreview;
