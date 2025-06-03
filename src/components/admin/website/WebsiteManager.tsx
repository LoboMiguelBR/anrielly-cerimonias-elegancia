
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Layout, Palette, Settings, Globe } from 'lucide-react';
import PagesManager from './PagesManager';
import SectionsManager from './SectionsManager';
import ThemeCustomizer from './ThemeCustomizer';
import SEOSettings from './SEOSettings';
import CMSLandingPages from './CMSLandingPages';

const WebsiteManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CMS do Website</h2>
        <p className="text-gray-600">Gerencie o conteúdo e aparência do seu website</p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Páginas
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Seções
          </TabsTrigger>
          <TabsTrigger value="landing-pages" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Landing Pages
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <PagesManager />
        </TabsContent>

        <TabsContent value="sections">
          <SectionsManager />
        </TabsContent>

        <TabsContent value="landing-pages">
          <CMSLandingPages />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeCustomizer />
        </TabsContent>

        <TabsContent value="seo">
          <SEOSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteManager;
