
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Eye, Edit } from 'lucide-react';

const SectionsManager = () => {
  const sections = [
    { id: '1', title: 'Hero Principal', type: 'hero', page: 'Página Inicial', active: true },
    { id: '2', title: 'Sobre Nós', type: 'about', page: 'Página Inicial', active: true },
    { id: '3', title: 'Nossos Serviços', type: 'services', page: 'Página Inicial', active: true },
    { id: '4', title: 'Galeria de Fotos', type: 'gallery', page: 'Página Inicial', active: true },
    { id: '5', title: 'Depoimentos', type: 'testimonials', page: 'Página Inicial', active: true },
    { id: '6', title: 'Entre em Contato', type: 'contact', page: 'Página Inicial', active: true }
  ];

  const getSectionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      hero: 'Banner Principal',
      about: 'Sobre',
      services: 'Serviços',
      gallery: 'Galeria',
      testimonials: 'Depoimentos',
      contact: 'Contato',
      custom: 'Personalizada'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciar Seções</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Seção
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{section.title}</h4>
                    <p className="text-sm text-gray-500">
                      {getSectionTypeLabel(section.type)} • {section.page}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    section.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {section.active ? 'Ativa' : 'Inativa'}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionsManager;
