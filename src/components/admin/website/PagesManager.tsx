
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';

const PagesManager = () => {
  const [pages] = useState([
    { id: '1', title: 'Página Inicial', slug: 'home', status: 'published', page_type: 'home' },
    { id: '2', title: 'Sobre', slug: 'about', status: 'published', page_type: 'about' },
    { id: '3', title: 'Serviços', slug: 'services', status: 'published', page_type: 'services' },
    { id: '4', title: 'Contato', slug: 'contact', status: 'published', page_type: 'contact' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciar Páginas</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Página
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                    {page.status === 'published' ? 'Publicada' : 
                     page.status === 'draft' ? 'Rascunho' : 'Arquivada'}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-4 w-4" />
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

export default PagesManager;
