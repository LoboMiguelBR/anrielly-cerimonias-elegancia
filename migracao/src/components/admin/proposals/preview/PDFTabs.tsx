
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import PDFPreviewContent from './PDFPreviewContent';
import HtmlProposalRenderer from '../templates/HtmlProposalRenderer';

interface PDFTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  proposal: ProposalData;
  template: ProposalTemplateData;
  isLoading: boolean;
  pdfError: string | null;
  onBack: () => void;
  onError: (error: string) => void;
  onPdfReady?: (blob: Blob) => void;
}

const PDFTabs: React.FC<PDFTabsProps> = ({
  activeTab,
  setActiveTab,
  proposal,
  template,
  isLoading,
  pdfError,
  onBack,
  onError,
  onPdfReady
}) => {
  const isHtmlTemplate = proposal.template_id && proposal.template_id !== 'default';
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white">
      <TabsList className="bg-gray-100 border-b rounded-none justify-center">
        <TabsTrigger value="preview">Visualizar</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="p-4">
        {isHtmlTemplate ? (
          <HtmlProposalRenderer 
            proposal={proposal} 
            templateId={proposal.template_id}
            onPdfReady={onPdfReady}
            onError={onError}
            previewOnly={true}
          />
        ) : (
          <PDFPreviewContent
            proposal={proposal}
            template={template}
            isLoading={isLoading}
            pdfError={pdfError}
            onBack={onBack}
            onError={onError}
            onPdfReady={onPdfReady}
          />
        )}
      </TabsContent>

      <TabsContent value="html" className="p-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Código HTML da Proposta</h3>
          {isHtmlTemplate ? (
            <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
              <pre>{JSON.stringify(proposal, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Esta proposta usa o formato padrão e não um template HTML personalizado.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PDFTabs;
