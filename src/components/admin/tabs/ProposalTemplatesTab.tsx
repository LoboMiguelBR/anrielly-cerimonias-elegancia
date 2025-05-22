
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HtmlTemplateManager from '../proposals/templates/HtmlTemplateManager';

const ProposalTemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("html-templates");

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200">
        <div className="mb-6">
          <h2 className="text-2xl font-playfair font-semibold mb-2">
            Editor de Templates de Propostas
          </h2>
          <p className="text-gray-500">
            Crie e personalize templates HTML para suas propostas
          </p>
        </div>
        
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
