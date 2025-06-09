
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, Edit, Trash2, Mail, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuestionarioActions } from '@/hooks/useQuestionarioActions';
import EditQuestionarioModal from './EditQuestionarioModal';
import QuestionarioStatusSelect from './QuestionarioStatusSelect';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Questionario } from '@/components/admin/tabs/types/questionario';

interface QuestionariosTableEnhancedProps {
  questionarios: Questionario[];
  isLoading: boolean;
  onRefresh: () => void;
}

const QuestionariosTableEnhanced = ({ questionarios, isLoading, onRefresh }: QuestionariosTableEnhancedProps) => {
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);
  const [editingQuestionario, setEditingQuestionario] = useState<Questionario | null>(null);
  const [deletingQuestionario, setDeletingQuestionario] = useState<Questionario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { deleteQuestionario, resendAccessEmail, loading: actionLoading } = useQuestionarioActions();

  const getStatusBadge = (status: string | null) => {
    // Garantir que status não seja null/undefined
    const safeStatus = status || 'rascunho';
    
    switch (safeStatus) {
      case 'rascunho':
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Rascunho</Badge>;
      case 'enviado':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Enviado</Badge>;
      case 'respondido':
        return <Badge variant="outline" className="text-green-600 border-green-200">Respondido</Badge>;
      case 'processado':
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Processado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="text-red-600 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">{safeStatus}</Badge>;
    }
  };

  const filteredQuestionarios = questionarios.filter(q => 
    searchTerm === '' || 
    q.nome_responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingQuestionario) return;
    
    const success = await deleteQuestionario(deletingQuestionario.id);
    if (success) {
      onRefresh();
      setDeletingQuestionario(null);
    }
  };

  const handleResendEmail = async (questionario: Questionario) => {
    await resendAccessEmail(questionario);
  };

  const handleEditSuccess = () => {
    onRefresh();
    setEditingQuestionario(null);
  };

  const handleStatusChange = () => {
    onRefresh();
  };

  // Função para formatar data com segurança
  const formatSafeDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      console.warn('Erro ao formatar data:', dateString, error);
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredQuestionarios.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum questionário encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestionarios.map((questionario) => (
            <Card key={questionario.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{questionario.nome_responsavel || 'Nome não informado'}</h3>
                      <QuestionarioStatusSelect
                        questionarioId={questionario.id}
                        currentStatus={questionario.status || 'rascunho'}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                      <div>
                        <strong>Email:</strong> {questionario.email || 'Email não informado'}
                      </div>
                      <div>
                        <strong>Respostas:</strong> {questionario.total_perguntas_resp || 0}
                      </div>
                      <div>
                        <strong>História:</strong> {questionario.historia_processada ? 'Processada' : 'Pendente'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Criado em {formatSafeDate(questionario.data_criacao)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuestionario(questionario)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuestionario(questionario)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendEmail(questionario)}
                      disabled={actionLoading}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reenviar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/questionario-login?link=${questionario.link_publico}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingQuestionario(questionario)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedQuestionario} onOpenChange={() => setSelectedQuestionario(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Questionário</DialogTitle>
          </DialogHeader>
          
          {selectedQuestionario && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedQuestionario.nome_responsavel || 'Nome não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedQuestionario.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedQuestionario.email || 'Email não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Respostas</label>
                  <p className="text-gray-900">{selectedQuestionario.total_perguntas_resp || 0} respondidas</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Link Público</label>
                  <p className="text-gray-900 break-all">{selectedQuestionario.link_publico || 'Link não disponível'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">História Processada</label>
                  <p className="text-gray-900">{selectedQuestionario.historia_processada ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Criado em</label>
                  <p className="text-gray-900">{formatSafeDate(selectedQuestionario.data_criacao)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Atualizado em</label>
                  <p className="text-gray-900">{formatSafeDate(selectedQuestionario.data_atualizacao)}</p>
                </div>
              </div>
              
              {selectedQuestionario.historia_gerada && (
                <div>
                  <label className="text-sm font-medium text-gray-700">História Gerada</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedQuestionario.historia_gerada}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <EditQuestionarioModal
        open={!!editingQuestionario}
        onOpenChange={() => setEditingQuestionario(null)}
        onSuccess={handleEditSuccess}
        questionario={editingQuestionario}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingQuestionario} onOpenChange={() => setDeletingQuestionario(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o questionário de "{deletingQuestionario?.nome_responsavel || 'usuário'}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionariosTableEnhanced;
