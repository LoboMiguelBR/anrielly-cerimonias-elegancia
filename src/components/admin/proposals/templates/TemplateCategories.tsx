import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  tags: string[];
  usage_count: number;
  last_used_at: string;
  is_default: boolean;
}

interface TemplateCategoriesProps {
  onTemplateSelect?: (template: Template) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const TemplateCategories: React.FC<TemplateCategoriesProps> = ({
  onTemplateSelect,
  selectedCategory = 'all',
  onCategoryChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: templates, isLoading } = useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_template_html')
        .select('id, name, category, tags, usage_count, last_used_at, is_default')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      return data as Template[];
    },
  });

  // Get unique categories
  const categories = templates
    ? ['all', ...new Set(templates.map(t => t.category || 'general'))]
    : ['all'];

  // Filter templates
  const filteredTemplates = templates?.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Templates por Categoria</span>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas as categorias' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Templates */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando templates...
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Nenhum template encontrado com os filtros aplicados'
                  : 'Nenhum template cadastrado'
                }
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onTemplateSelect?.(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        {template.is_default && (
                          <Badge variant="default" className="text-xs">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category || 'Geral'}
                        </Badge>
                        <span>•</span>
                        <span>{template.usage_count || 0} usos</span>
                        {template.last_used_at && (
                          <>
                            <span>•</span>
                            <span>
                              Último uso: {new Date(template.last_used_at).toLocaleDateString('pt-BR')}
                            </span>
                          </>
                        )}
                      </div>

                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};