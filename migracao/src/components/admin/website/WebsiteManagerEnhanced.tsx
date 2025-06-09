
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CMSStatusDashboard from './CMSStatusDashboard';
import CMSInitializerEnhanced from './CMSInitializerEnhanced';
import PagesManagerEnhanced from './PagesManagerEnhanced';
import SectionsManagerEnhanced from './SectionsManagerEnhanced';
import SEOSettingsEnhanced from './SEOSettingsEnhanced';
import ThemeCustomizerEnhanced from './ThemeCustomizerEnhanced';
import ServicesManager from '../services/ServicesManager';

const WebsiteManagerEnhanced = () => {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gerenciamento do Website</h2>
        <p className="text-gray-600">
          Configure páginas, seções, SEO e aparência do seu website com sistema CMS avançado
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="initializer">Setup</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <CMSStatusDashboard />
        </TabsContent>

        <TabsContent value="initializer" className="space-y-4">
          <CMSInitializerEnhanced />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <PagesManagerEnhanced />
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <SectionsManagerEnhanced />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Integração com CMS</h3>
            <p className="text-sm text-blue-700">
              Os serviços gerenciados aqui são integrados automaticamente ao CMS. 
              Eles podem ser sobrescritos pelas configurações das seções do CMS para maior flexibilidade.
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

export default WebsiteManagerEnhanced;
