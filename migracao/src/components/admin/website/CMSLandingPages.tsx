
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Plus, ExternalLink } from "lucide-react";
import { useWebsitePages } from '@/hooks/useWebsitePages';

const CMSLandingPages = () => {
  const { pages, isLoading } = useWebsitePages();
  
  // Filtrar apenas páginas que eram landing pages (identificadas pelo meta_keywords)
  const landingPages = pages.filter(page => 
    page.meta_keywords?.includes('landing-page-migrated')
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando landing pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Landing Pages</h3>
          <p className="text-sm text-gray-600">
            Landing pages migradas do sistema anterior. Gerencie através das abas Páginas e Seções.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '#pages'}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Nova via CMS
        </Button>
      </div>

      <div className="grid gap-4">
        {landingPages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={page.status === 'published' ? "default" : "secondary"}>
                    {page.status === 'published' ? "Publicada" : "Rascunho"}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Landing Page
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">URL:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    /{page.slug}
                  </code>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = '#pages'}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar no CMS
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {landingPages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma landing page migrada encontrada.</p>
          <p className="text-sm mt-1">
            Use as abas "Páginas" e "Seções" para criar novas landing pages.
          </p>
        </div>
      )}
    </div>
  );
};

export default CMSLandingPages;
