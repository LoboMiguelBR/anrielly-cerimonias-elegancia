import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Eye, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TemplateVersion {
  id: string;
  version_number: number;
  change_summary: string;
  created_at: string;
  html_content: string;
  css_content: string;
  variables: Record<string, any>;
}

interface TemplateVersionHistoryProps {
  templateId: string;
  onRestore?: (version: TemplateVersion) => void;
}

export const TemplateVersionHistory: React.FC<TemplateVersionHistoryProps> = ({
  templateId,
  onRestore,
}) => {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as TemplateVersion[];
    },
    enabled: !!templateId,
  });

  if (!templateId) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Versões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando histórico...
            </div>
          ) : !versions || versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma versão encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        v{version.version_number}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(version.created_at), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onRestore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRestore(version)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {version.change_summary && (
                    <div className="text-sm">
                      <strong>Alterações:</strong> {version.change_summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};