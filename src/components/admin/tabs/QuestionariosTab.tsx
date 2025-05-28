
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useSWR from 'swr';
import type { Database } from '@/integrations/supabase/types';
import KPICards from './components/KPICards';
import QuestionarioEditModal from './components/QuestionarioEditModal';
import QuestionarioHistoryViewer from './components/QuestionarioHistoryViewer';
import QuestionarioCreateForm from './components/QuestionarioCreateForm';
import QuestionarioAnswersModal from './components/QuestionarioAnswersModal';
import QuestionarioGroup, { type Questionario, type QuestionarioGroup as QuestionarioGroupType } from './components/QuestionarioGroup';
import { useQuestionarioWordExport } from '@/hooks/useQuestionarioWordExport';

type QuestionarioRow = Database['public']['Tables']['questionarios_noivos']['Row'];

const QuestionariosTab = () => {
  const { toast } = useToast();
  const { exportQuestionario: exportWord, isExporting } = useQuestionarioWordExport();
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingQuestionario, setEditingQuestionario] = useState<Questionario | null>(null);
  const [deletingQuestionario, setDeletingQuestionario] = useState<Questionario | null>(null);
  const [viewingHistory, setViewingHistory] = useState<Questionario | null>(null);

  const fetcher = async (): Promise<Questionario[]> => {
    const { data, error } = await supabase
      .from('questionarios_noivos')
      .select('*')
      .order('data_criacao', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map((row: QuestionarioRow): Questionario => ({
      id: row.id,
      link_publico: row.link_publico,
      nome_responsavel: row.nome_responsavel,
      email: row.email,
      status: row.status || 'rascunho',
      data_criacao: row.data_criacao || '',
      data_atualizacao: row.data_atualizacao || '',
      respostas_json: row.respostas_json as Record<string, string> | null,
      total_perguntas_resp: row.total_perguntas_resp || 0,
      historia_gerada: row.historia_gerada || undefined
    }));
  };

  const { data: questionarios, error, mutate } = useSWR('questionarios_noivos', fetcher);

  // Agrupar questionários por link_publico
  const groupedQuestionarios: QuestionarioGroupType[] = questionarios 
    ? Object.entries(
        questionarios.reduce((groups: Record<string, Questionario[]>, questionario) => {
          if (!groups[questionario.link_publico]) {
            groups[questionario.link_publico] = [];
          }
          groups[questionario.link_publico].push(questionario);
          return groups;
        }, {})
      ).map(([link_publico, questionariosDoGrupo]) => {
        const totalRespostas = questionariosDoGrupo.reduce((total, q) => {
          return total + (q.total_perguntas_resp || 0);
        }, 0);
        
        const maxPossivel = questionariosDoGrupo.length * 48; // 48 perguntas por pessoa
        const progresso = maxPossivel > 0 ? Math.round((totalRespostas / maxPossivel) * 100) : 0;

        return {
          link_publico,
          questionarios: questionariosDoGrupo,
          totalRespostas,
          progresso
        };
      })
    : [];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const toggleGroupExpansion = (linkPublico: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(linkPublico)) {
      newExpanded.delete(linkPublico);
    } else {
      newExpanded.add(linkPublico);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDeleteQuestionario = async () => {
    if (!deletingQuestionario) return;

    try {
      const { error } = await supabase
        .from('questionarios_noivos')
        .delete()
        .eq('id', deletingQuestionario.id);

      if (error) throw error;

      toast({
        title: "Questionário excluído!",
        description: "O questionário foi removido com sucesso.",
      });

      mutate();
      setDeletingQuestionario(null);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o questionário.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (questionario: Questionario) => {
    await exportWord(questionario);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Erro ao carregar questionários: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* KPI Cards */}
        {questionarios && <KPICards questionarios={questionarios} />}

        {/* Create Form */}
        <QuestionarioCreateForm onQuestionarioCreated={mutate} />

        {/* Groups List */}
        <div className="space-y-4">
          {groupedQuestionarios.map((grupo) => (
            <QuestionarioGroup
              key={grupo.link_publico}
              grupo={grupo}
              expanded={expandedGroups.has(grupo.link_publico)}
              onToggle={() => toggleGroupExpansion(grupo.link_publico)}
              onCopyLink={copyToClipboard}
              onViewAnswers={setSelectedQuestionario}
              onViewHistory={setViewingHistory}
              onEdit={setEditingQuestionario}
              onExport={handleExport}
              onDelete={setDeletingQuestionario}
              isExporting={isExporting}
            />
          ))}
          
          {groupedQuestionarios.length === 0 && (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                Nenhum questionário criado ainda
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Visualização de Respostas */}
        {selectedQuestionario && (
          <QuestionarioAnswersModal
            questionario={selectedQuestionario}
            onClose={() => setSelectedQuestionario(null)}
          />
        )}

        {/* Modal de Visualização da História IA */}
        <Dialog open={!!viewingHistory} onOpenChange={(open) => !open && setViewingHistory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>História Gerada por IA</DialogTitle>
            </DialogHeader>
            {viewingHistory && (
              <QuestionarioHistoryViewer
                questionarioId={viewingHistory.id}
                nomeResponsavel={viewingHistory.nome_responsavel}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <QuestionarioEditModal
          open={!!editingQuestionario}
          onClose={() => setEditingQuestionario(null)}
          questionario={editingQuestionario}
          onSave={mutate}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deletingQuestionario} onOpenChange={(open) => !open && setDeletingQuestionario(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Questionário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o questionário de{' '}
                <strong>{deletingQuestionario?.nome_responsavel}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuestionario} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default QuestionariosTab;
