
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PagesManagerEnhanced from './PagesManagerEnhanced';
import SectionsManager from './SectionsManager';
import SEOSettingsEnhanced from './SEOSettingsEnhanced';
import ThemeCustomizerEnhanced from './ThemeCustomizerEnhanced';
import CMSInitializer from './CMSInitializer';
import ServicesManager from '../services/ServicesManager';

const WebsiteManager = () => {
  const [activeTab, setActiveTab] = useState('initializer');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gerenciamento do Website</h2>
        <p className="text-gray-600">
          Configure páginas, seções, SEO e aparência do seu website
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="initializer">Inicializar</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="initializer" className="space-y-4">
          <CMSInitializer />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <PagesManagerEnhanced />
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <SectionsManager />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Integração com CMS</h3>
            <p className="text-sm text-blue-700">
              Os serviços gerenciados aqui serão migrados automaticamente para o CMS quando você 
              inicializar o sistema. Após a migração, os serviços serão gerenciados através das 
              seções do CMS para maior flexibilidade.
            </p>
          </div>
          <ServicesManager />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOSettingsEnhanced />
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <ThemeCustomizerEnhanced />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteManager;
