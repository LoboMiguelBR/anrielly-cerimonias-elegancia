
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplatePreviewProps {
  htmlContent: string;
  cssContent: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ htmlContent, cssContent }) => {
  if (!htmlContent) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Preview do Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded p-4 bg-white max-h-96 overflow-auto">
          <style dangerouslySetInnerHTML={{ __html: cssContent || '' }} />
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreview;
