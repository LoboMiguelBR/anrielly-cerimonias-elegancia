
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, Edit, Trash2, Mail, ExternalLink, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuestionarioActions } from '@/hooks/useQuestionarioActions';
import EditQuestionarioModal from './EditQuestionarioModal';
import QuestionarioStatusSelect from './QuestionarioStatusSelect';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Questionario {
  id: string;
  nome_responsavel: string;
  email: string;
  link_publico: string;
  status: string;
  total_perguntas_resp: number;
  data_criacao: string;
  data_atualizacao: string;
  historia_processada?: boolean | null;
  historia_gerada?: string | null;
  respostas_json: any;
}

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

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        return <Badge variant="outline" className="text-gray-600 border-gray-200">{status}</Badge>;
    }
  };

  // Agrupar questionários por link_publico para mostrar casais
  const questionariosPorCasal = questionarios.reduce((acc, q) => {
    if (!acc[q.link_publico]) {
      acc[q.link_publico] = [];
    }
    acc[q.link_publico].push(q);
    return acc;
  }, {} as Record<string, Questionario[]>);

  const casaisComFiltro = Object.entries(questionariosPorCasal).filter(([linkPublico, questionariosDoCasal]) => {
    if (searchTerm === '') return true;
    
    return questionariosDoCasal.some(q => 
      q.nome_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linkPublico.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          placeholder="Buscar por nome, email ou link público..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {casaisComFiltro.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum questionário encontrado</p>
            </CardContent>
          </Card>
        ) : (
          casaisComFiltro.map(([linkPublico, questionariosDoCasal]) => {
            const primeiroQuestionario = questionariosDoCasal[0];
            const totalRespostas = questionariosDoCasal.reduce((sum, q) => sum + (q.total_perguntas_resp || 0), 0);
            const temHistoria = questionariosDoCasal.some(q => q.historia_gerada);
            
            return (
              <Card key={linkPublico} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Casal: {linkPublico}</h3>
                        <QuestionarioStatusSelect
                          questionarioId={primeiroQuestionario.id}
                          currentStatus={primeiroQuestionario.status}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          <strong>Participantes:</strong> {questionariosDoCasal.length}
                        </div>
                        <div>
                          <strong>Total Respostas:</strong> {totalRespostas}
                        </div>
                        <div>
                          <strong>História:</strong> {temHistoria ? 'Gerada' : 'Pendente'}
                        </div>
                      </div>

                      {/* Lista dos participantes */}
                      <div className="mb-2">
                        <strong className="text-sm text-gray-700">Participantes:</strong>
                        <div className="ml-2 mt-1 space-y-1">
                          {questionariosDoCasal.map((q) => (
                            <div key={q.id} className="text-sm text-gray-600 flex items-center gap-2">
                              <span>• {q.nome_responsavel}</span>
                              <span className="text-gray-400">({q.email})</span>
                              <span className="text-gray-400">- {q.total_perguntas_resp || 0} respostas</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Criado em {format(new Date(primeiroQuestionario.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuestionario(primeiroQuestionario)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/questionario/${linkPublico}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Link
                      </Button>
                      {questionariosDoCasal.map((q) => (
                        <div key={q.id} className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingQuestionario(q)}
                            title={`Editar ${q.nome_responsavel}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingQuestionario(q)}
                            title={`Deletar ${q.nome_responsavel}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
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
                  <label className="text-sm font-medium text-gray-700">Link Público</label>
                  <p className="text-gray-900 break-all">{selectedQuestionario.link_publico}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedQuestionario.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedQuestionario.nome_responsavel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedQuestionario.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Respostas</label>
                  <p className="text-gray-900">{selectedQuestionario.total_perguntas_resp || 0} respondidas</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">História Processada</label>
                  <p className="text-gray-900">{selectedQuestionario.historia_processada ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Criado em</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedQuestionario.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Atualizado em</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedQuestionario.data_atualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
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
              Tem certeza que deseja deletar o questionário de "{deletingQuestionario?.nome_responsavel}"? Esta ação não pode ser desfeita.
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
