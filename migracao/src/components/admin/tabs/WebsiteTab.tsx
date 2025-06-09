
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebsiteManager from '../website/WebsiteManager';
import CMSLandingPages from '../website/CMSLandingPages';
import { Monitor, Settings, Globe, Layout } from 'lucide-react';

const WebsiteTab = () => {
  const [activeTab, setActiveTab] = useState('cms');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website & CMS</h1>
          <p className="text-gray-600">
            Gerencie o conteúdo do seu website e sistema CMS
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cms" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema CMS
          </TabsTrigger>
          <TabsTrigger value="landing-pages" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Landing Pages
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Visualizar Site
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cms" className="space-y-4">
          <WebsiteManager />
        </TabsContent>

        <TabsContent value="landing-pages" className="space-y-4">
          <CMSLandingPages />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Website</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Visualize como seu website aparece para os visitantes.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <a 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">Página Principal</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ver a página principal do website
                    </p>
                  </a>
                  
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-500">Landing Pages Dinâmicas</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Disponível após configurar landing pages no CMS
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteTab;
