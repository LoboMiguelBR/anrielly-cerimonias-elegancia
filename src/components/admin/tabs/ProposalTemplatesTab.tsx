
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import HtmlTemplateManager from '../proposals/templates/HtmlTemplateManager';
import { fetchHtmlTemplates } from '../proposals/templates/html-editor/templateHtmlService';
import { toast } from 'sonner';

const ProposalTemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("html-templates");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const templates = await fetchHtmlTemplates();
      console.log(`Refreshed templates: ${templates.length} found`);
      
      if (templates.length === 0) {
        console.log('No templates found, displaying warning');
      }
      
      toast.success('Templates atualizados com sucesso');
    } catch (error) {
      console.error('Error refreshing templates:', error);
      setHasError(true);
      toast.error('Erro ao atualizar templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check database connection on component mount
    const checkConnection = async () => {
      try {
        await fetchHtmlTemplates();
      } catch (error) {
        console.error('Error fetching templates on load:', error);
        setHasError(true);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-playfair font-semibold mb-2">
              Editor de Templates de Propostas
            </h2>
            <p className="text-gray-500">
              Crie e personalize templates HTML para suas propostas
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar templates
          </Button>
        </div>
        
        {hasError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
              <div>
                <h3 className="font-medium">Problema de conexão</h3>
                <p className="text-sm">
                  Não foi possível se conectar ao banco de dados. Tente atualizar a página ou clique no botão "Atualizar templates".
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="html-templates">
              Templates HTML
            </TabsTrigger>
            <TabsTrigger value="sections">
              Seções Reutilizáveis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="html-templates">
            <HtmlTemplateManager />
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="text-center py-12 text-gray-500">
              Esta funcionalidade será implementada em breve.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProposalTemplatesTab;
