
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, User, FileText, CheckCircle, Eye, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AtividadeRecente {
  id: string;
  tipo: 'lead' | 'proposal' | 'contract';
  clienteNome: string;
  clienteEmail: string;
  data: string;
  status: string;
  valor?: number;
}

interface FeedAtividadesProps {
  atividades: AtividadeRecente[];
  isLoading: boolean;
}

const FeedAtividades: React.FC<FeedAtividadesProps> = ({ atividades, isLoading }) => {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'lead': return <User className="h-4 w-4" />;
      case 'proposal': return <FileText className="h-4 w-4" />;
      case 'contract': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'lead': return 'Lead';
      case 'proposal': return 'Proposta';
      case 'contract': return 'Contrato';
      default: return tipo;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'aguardando': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviado';
      case 'signed': return 'Assinado';
      case 'aguardando': return 'Aguardando';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleViewDetails = (atividade: AtividadeRecente) => {
    // Aqui integraria com as rotas existentes
    const baseUrl = `/admin`;
    switch (atividade.tipo) {
      case 'lead':
        window.open(`${baseUrl}/quotes`, '_blank');
        break;
      case 'proposal':
        window.open(`${baseUrl}/proposals`, '_blank');
        break;
      case 'contract':
        window.open(`${baseUrl}/contracts`, '_blank');
        break;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {atividades.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade recente</p>
          </div>
        ) : (
          atividades.map((atividade) => (
            <div key={atividade.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getTipoIcon(atividade.tipo)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={getTipoColor(atividade.tipo)}>
                      {getTipoLabel(atividade.tipo)}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(atividade.status)}>
                      {getStatusLabel(atividade.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {atividade.clienteNome}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {atividade.clienteEmail}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(atividade.data), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    {atividade.valor && (
                      <span className="text-xs font-medium text-green-600">
                        {formatCurrency(atividade.valor)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewDetails(atividade)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Ver
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FeedAtividades;
