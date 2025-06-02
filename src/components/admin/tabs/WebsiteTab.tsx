
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, FileText, Palette, Settings } from 'lucide-react';
import PagesManager from '../website/PagesManager';
import SectionsManager from '../website/SectionsManager';
import ThemeCustomizer from '../website/ThemeCustomizer';
import SEOSettings from '../website/SEOSettings';

const WebsiteTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CMS do Website</h2>
        <p className="text-gray-600">Gerencie o conteúdo e aparência do seu website</p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Páginas
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Seções
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

export default WebsiteTab;
