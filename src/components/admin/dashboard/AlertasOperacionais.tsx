
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Mail, Edit, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AlertaOperacional {
  id: string;
  tipo: 'orcamento_vencido' | 'contrato_vencendo' | 'lead_sem_orcamento';
  titulo: string;
  descricao: string;
  clienteNome: string;
  dataLimite?: string;
  acoes: Array<{
    label: string;
    type: 'reenviar' | 'editar' | 'criar';
    url?: string;
  }>;
}

interface AlertasOperacionaisProps {
  alertas: AlertaOperacional[];
  onRefresh: () => void;
}

const AlertasOperacionais: React.FC<AlertasOperacionaisProps> = ({ alertas, onRefresh }) => {
  const handleAction = async (alerta: AlertaOperacional, acao: { label: string; type: string; url?: string }) => {
    switch (acao.type) {
      case 'reenviar':
        // Aqui integraria com a função de reenvio existente
        toast.success(`Orçamento reenviado para ${alerta.clienteNome}`);
        break;
      
      case 'editar':
        if (acao.url) {
          window.open(acao.url, '_blank');
        }
        break;
      
      case 'criar':
        // Aqui integraria com o modal de criação existente
        toast.info('Abrindo formulário de criação...');
        break;
      
      default:
        break;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'orcamento_vencido': return <Clock className="h-4 w-4" />;
      case 'contrato_vencendo': return <AlertTriangle className="h-4 w-4" />;
      case 'lead_sem_orcamento': return <FileText className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'orcamento_vencido': return 'bg-yellow-100 text-yellow-800';
      case 'contrato_vencendo': return 'bg-red-100 text-red-800';
      case 'lead_sem_orcamento': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'reenviar': return <Mail className="h-3 w-3" />;
      case 'editar': return <Edit className="h-3 w-3" />;
      case 'criar': return <Plus className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Alertas Operacionais
          {alertas.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alertas.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alertas.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum alerta operacional no momento</p>
            <p className="text-sm text-gray-400">Seu negócio está funcionando perfeitamente!</p>
          </div>
        ) : (
          alertas.map((alerta) => (
            <div key={alerta.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTipoIcon(alerta.tipo)}
                  <Badge variant="secondary" className={getTipoColor(alerta.tipo)}>
                    {alerta.tipo.replace('_', ' ')}
                  </Badge>
                </div>
                {alerta.dataLimite && (
                  <span className="text-xs text-gray-500">
                    {new Date(alerta.dataLimite).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              
              <h4 className="font-medium text-gray-900 mb-1">{alerta.titulo}</h4>
              <p className="text-sm text-gray-600 mb-3">{alerta.descricao}</p>
              
              <div className="flex gap-2 flex-wrap">
                {alerta.acoes.map((acao, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(alerta, acao)}
                    className="flex items-center gap-1"
                  >
                    {getActionIcon(acao.type)}
                    {acao.label}
                  </Button>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AlertasOperacionais;
