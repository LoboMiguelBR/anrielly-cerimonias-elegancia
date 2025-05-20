
import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from '../ProposalPDF';
import { ProposalData } from '../pdf/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Download, Eye, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ProposalPreviewProps {
  proposal: ProposalData | null;
  onBack: () => void;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderKey, setRenderKey] = useState<number>(0); // Usado para forçar re-render do PDF
  
  console.log("Rendering ProposalPreview with proposal:", proposal);
  
  useEffect(() => {
    // Reset error state when proposal changes
    setPdfError(null);
    setIsLoading(true);
    
    // Forçar re-render do componente para garantir que o PDF seja carregado
    setRenderKey(prev => prev + 1);
    
    // Simulate loading complete após um tempo
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("PDF loading timeout complete");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [proposal]);
  
  if (!proposal) {
    console.log("No proposal data available");
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

  // Verifica se todos os campos necessários da proposta estão preenchidos
  const proposalIsComplete = proposal && 
                           proposal.client_name && 
                           proposal.event_type && 
                           proposal.services.length > 0;

  console.log("Proposal is complete:", proposalIsComplete);

  const handlePdfError = (error: Error) => {
    console.error('Erro ao gerar PDF:', error);
    setPdfError(`Erro ao carregar o PDF: ${error.message}`);
    setIsLoading(false);
  };

  const handleEmailProposal = () => {
    // This is a placeholder for future email functionality
    toast.info("Funcionalidade de envio por email será implementada em breve");
  };

  // Criar o nome do arquivo baseado no nome do cliente
  const getPdfFilename = () => {
    const cleanName = proposal.client_name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
    return `proposta_${cleanName}.pdf`;
  };

  return (
    <div className="bg-white border rounded-lg" key={renderKey}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">
          Proposta para {proposal.client_name || "Cliente"}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          
          {/* Sempre mostramos o botão de download, mesmo se houver erro no preview */}
          <PDFDownloadLink
            document={<ProposalPDF proposal={proposal} />}
            fileName={getPdfFilename()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold h-9 px-3 py-2"
          >
            {({ loading, error }) => {
              if (loading) return "Preparando PDF...";
              
              if (error) {
                console.error("Erro ao preparar PDF:", error);
                return (
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Erro
                  </span>
                );
              }
              
              return (
                <span className="flex items-center">
                  <Download className="w-4 h-4 mr-2" /> Baixar PDF
                </span>
              );
            }}
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
          {pdfError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar PDF</AlertTitle>
              <AlertDescription>
                {pdfError}
                <div className="mt-2">
                  <p className="text-sm">Possíveis soluções:</p>
                  <ul className="text-sm list-disc pl-5 mt-1">
                    <li>Verifique sua conexão com a internet</li>
                    <li>Verifique se todos os dados da proposta estão preenchidos</li>
                    <li>Tente atualizar a página e gerar a proposta novamente</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-[800px] bg-white">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando visualização da proposta...</p>
              </div>
            </div>
          ) : (
            <div className="h-[800px]">
              {proposalIsComplete ? (
                <PDFViewer 
                  width="100%" 
                  height="100%" 
                  className="border"
                  showToolbar={true}
                >
                  <ProposalPDF proposal={proposal} />
                </PDFViewer>
              ) : (
                <div className="flex items-center justify-center h-full bg-white p-8 text-center">
                  <div>
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Dados insuficientes para gerar o PDF</h3>
                    <p className="text-gray-600 mb-4">
                      Alguns campos obrigatórios não foram preenchidos. Verifique se você preencheu:
                    </p>
                    <ul className="text-left text-sm list-disc pl-8 mb-4">
                      <li className={proposal.client_name ? "text-green-600" : "text-red-600"}>
                        Nome do cliente
                      </li>
                      <li className={proposal.event_type ? "text-green-600" : "text-red-600"}>
                        Tipo de evento
                      </li>
                      <li className={proposal.services.length > 0 ? "text-green-600" : "text-red-600"}>
                        Serviços incluídos
                      </li>
                    </ul>
                    <Button variant="outline" size="sm" onClick={onBack}>
                      <ChevronLeft className="w-4 h-4 mr-2" /> Voltar para edição
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalPreview;
