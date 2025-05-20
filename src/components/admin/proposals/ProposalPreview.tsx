
import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import ProposalPDF from '../ProposalPDF';
import { ProposalData } from '../pdf/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Download, Eye, Mail } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'sonner';

interface ProposalPreviewProps {
  proposal: ProposalData | null;
  onBack: () => void;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  
  if (!proposal) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Previsualização da Proposta</h3>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
        <div className="p-12 text-center">
          <p className="text-gray-500">Nenhuma proposta foi gerada ainda.</p>
        </div>
      </div>
    );
  }

  const handleEmailProposal = () => {
    // This is a placeholder for future email functionality
    toast.info("Funcionalidade de envio por email será implementada em breve");
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">Proposta para {proposal.client_name}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <PDFDownloadLink
            document={<ProposalPDF proposal={proposal} />}
            fileName={`proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold h-9 px-3 py-2"
          >
            {({ loading }) => (
              loading ? 
              "Preparando PDF..." : 
              <span className="flex items-center">
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </span>
            )}
          </PDFDownloadLink>
          <Button 
            variant="outline"
            className="border-gold/50 text-gold/80 hover:bg-gold/10"
            onClick={handleEmailProposal}
          >
            <Mail className="w-4 h-4 mr-2" /> Enviar
          </Button>
        </div>
      </div>

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
          <div className="h-[800px]">
            <PDFViewer width="100%" height="100%" className="border">
              <ProposalPDF proposal={proposal} />
            </PDFViewer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalPreview;
