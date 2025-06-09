
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalTemplatePreviewProps {
  htmlContent?: string;
  cssContent?: string;
}

const ProposalTemplatePreview = ({ htmlContent = '', cssContent = '' }: ProposalTemplatePreviewProps) => {
  const previewContent = `
    <style>
      ${cssContent}
      .preview-container { 
        font-family: Arial, sans-serif; 
        padding: 20px; 
        background: white;
        min-height: 400px;
      }
    </style>
    <div class="preview-container">
      ${htmlContent}
    </div>
  `;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preview do Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
          {htmlContent ? (
            <iframe
              srcDoc={previewContent}
              className="w-full h-96 border-none"
              title="Template Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Digite o HTML para visualizar o preview
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalTemplatePreview;
