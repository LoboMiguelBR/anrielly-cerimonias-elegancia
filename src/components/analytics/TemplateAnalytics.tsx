import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Eye, Download, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplateStats {
  id: string;
  name: string;
  category: string;
  usage_count: number;
  last_used_at: string;
  average_rating: number;
  total_feedback: number;
}

export const TemplateAnalytics: React.FC = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['template-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_template_html')
        .select(`
          id,
          name,
          category,
          usage_count,
          last_used_at,
          template_feedback (
            rating
          )
        `)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data?.map(template => ({
        ...template,
        average_rating: template.template_feedback.length > 0
          ? template.template_feedback.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / template.template_feedback.length
          : 0,
        total_feedback: template.template_feedback.length,
      })) as TemplateStats[];
    },
  });

  const { data: topCategories } = useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_template_html')
        .select('category, usage_count')
        .not('category', 'is', null);

      if (error) throw error;

      const categoryStats = data?.reduce((acc, template) => {
        const category = template.category || 'general';
        if (!acc[category]) {
          acc[category] = { name: category, total_usage: 0, count: 0 };
        }
        acc[category].total_usage += template.usage_count || 0;
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { name: string; total_usage: number; count: number }>);

      return Object.values(categoryStats || {}).sort((a, b) => b.total_usage - a.total_usage);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalUsage = templates?.reduce((sum, t) => sum + (t.usage_count || 0), 0) || 0;
  const totalTemplates = templates?.length || 0;
  const averageRating = templates?.reduce((sum, t) => sum + t.average_rating, 0) / totalTemplates || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Templates</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates Ativos</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {templates?.filter(t => (t.usage_count || 0) > 0).length || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((templates?.filter(t => (t.usage_count || 0) > 0).length || 0) / totalTemplates) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Templates Mais Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates?.slice(0, 5).map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Categoria: {template.category || 'Geral'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {template.average_rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs ml-1">{template.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {template.usage_count} usos
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories?.slice(0, 5).map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.count} template{category.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{category.total_usage}</div>
                    <div className="text-xs text-muted-foreground">usos totais</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Melhoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {totalUsage === 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm font-medium text-orange-800">
                  Nenhum template foi utilizado ainda
                </div>
                <div className="text-xs text-orange-600">
                  Comece criando propostas para ver as estatísticas de uso
                </div>
              </div>
            )}
            
            {templates && templates.filter(t => t.average_rating < 3 && t.total_feedback > 0).length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-800">
                  {templates.filter(t => t.average_rating < 3 && t.total_feedback > 0).length} template(s) com avaliação baixa
                </div>
                <div className="text-xs text-red-600">
                  Considere revisar ou atualizar estes templates
                </div>
              </div>
            )}

            {templates && templates.filter(t => (t.usage_count || 0) === 0).length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  {templates.filter(t => (t.usage_count || 0) === 0).length} template(s) nunca utilizados
                </div>
                <div className="text-xs text-blue-600">
                  Considere promover ou remover templates não utilizados
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};