
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from 'lucide-react';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { ProposalTemplateData } from '../templates/shared/types';
import PDFPreviewContent from './PDFPreviewContent';

interface PDFTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
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
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="p-4"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="preview" className="flex items-center">
          <Eye className="w-4 h-4 mr-2" /> Visualização
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="preview" className="border rounded-lg p-1 bg-gray-100">
        <PDFPreviewContent
          proposal={proposal}
          template={template}
          isLoading={isLoading}
          pdfError={pdfError}
          onBack={onBack}
          onError={onError}
          onPdfReady={onPdfReady}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PDFTabs;
