import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, X, Calendar } from 'lucide-react';
import { ProjectTimelineItem } from '@/hooks/client-portal/useClientPortalData';

interface ClientPortalTimelineProps {
  timeline: ProjectTimelineItem[];
  loading: boolean;
}

export const ClientPortalTimeline = ({ timeline, loading }: ClientPortalTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'in_progress':
        return 'secondary' as const;
      case 'pending':
        return 'outline' as const;
      case 'cancelled':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline do Projeto</CardTitle>
          <CardDescription>Acompanhe o progresso do seu evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma atividade na timeline ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline do Projeto</CardTitle>
        <CardDescription>Acompanhe o progresso do seu evento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative border-l-4 ${getPriorityColor(item.priority)} pl-6 pb-6`}
            >
              {index !== timeline.length - 1 && (
                <div className="absolute left-[-2px] top-12 w-0.5 h-full bg-border"></div>
              )}
              
              <div className="absolute left-[-12px] top-2 bg-background border border-border rounded-full p-1">
                {getStatusIcon(item.status)}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                  <Badge variant={getStatusVariant(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {item.due_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo: {new Date(item.due_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {item.completed_at && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Concluído em: {new Date(item.completed_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  <Badge variant="outline" className="text-xs">
                    {item.priority === 'urgent' && 'Urgente'}
                    {item.priority === 'high' && 'Alta'}
                    {item.priority === 'medium' && 'Média'}
                    {item.priority === 'low' && 'Baixa'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};