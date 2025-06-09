
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, List, LayoutGrid } from "lucide-react";
import { useQuestionarios } from "@/hooks/useQuestionarios";
import { useQuestionarioActions } from "@/hooks/useQuestionarioActions";
import { useQuestionarioExport } from "@/hooks/useQuestionarioExport";
import QuestionarioCreateFormEnhanced from "./components/QuestionarioCreateFormEnhanced";
import QuestionariosTableEnhanced from "../questionarios/QuestionariosTableEnhanced";
import QuestionariosGroupedView from "./components/QuestionariosGroupedView";
import QuestionarioAnswersModal from "./components/QuestionarioAnswersModal";
import QuestionarioAdvancedEditor from "./components/QuestionarioAdvancedEditor";
import QuestionarioHistoryModal from "./components/QuestionarioHistoryModal";
import QuestionariosHeader from "./components/QuestionariosHeader";
import QuestionariosStats from "./components/QuestionariosStats";
import QuestionariosViewToggle from "./components/QuestionariosViewToggle";
import QuestionariosLoading from "./components/QuestionariosLoading";
import { Questionario } from '@/components/admin/tabs/types/questionario';

const QuestionariosTab = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const { questionarios, stats, isLoading, refetch } = useQuestionarios();
  const { deleteQuestionario, loading } = useQuestionarioActions();
  const { exportQuestionario, isExporting } = useQuestionarioExport();

  const handleViewAnswers = (questionario: Questionario) => {
    setSelectedQuestionario(questionario);
    setShowAnswersModal(true);
  };

  const handleEdit = (questionario: Questionario) => {
    setSelectedQuestionario(questionario);
    setShowAdvancedEditor(true);
  };

  const handleViewHistory = (questionario: Questionario) => {
    setSelectedQuestionario(questionario);
    setShowHistoryModal(true);
  };

  const handleExport = async (questionario: Questionario) => {
    await exportQuestionario(questionario.id, 'pdf');
  };

  const handleDelete = async (questionario: Questionario) => {
    if (window.confirm('Tem certeza que deseja excluir este questionário?')) {
      const success = await deleteQuestionario(questionario.id);
      if (success) {
        refetch();
      }
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setShowAdvancedEditor(false);
    refetch();
  };

  if (isLoading) {
    return <QuestionariosLoading />;
  }

  return (
    <div className="space-y-6">
      <QuestionariosHeader>
        <div className="flex items-center gap-2">
          <QuestionariosViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Questionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Questionário</DialogTitle>
              </DialogHeader>
              <QuestionarioCreateFormEnhanced onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </QuestionariosHeader>

      <QuestionariosStats stats={stats} />

      {viewMode === 'grouped' ? (
        <QuestionariosGroupedView
          questionarios={questionarios}
          onViewAnswers={handleViewAnswers}
          onViewHistory={handleViewHistory}
          onEdit={handleEdit}
          onExport={handleExport}
          onDelete={handleDelete}
          isExporting={isExporting}
        />
      ) : (
        <QuestionariosTableEnhanced
          questionarios={questionarios}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      )}

      {showAnswersModal && (
        <Dialog open={showAnswersModal} onOpenChange={setShowAnswersModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <QuestionarioAnswersModal
              questionario={selectedQuestionario}
              onClose={() => setShowAnswersModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAdvancedEditor && (
        <Dialog open={showAdvancedEditor} onOpenChange={setShowAdvancedEditor}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <QuestionarioAdvancedEditor
              questionario={selectedQuestionario}
              onClose={() => setShowAdvancedEditor(false)}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      <QuestionarioHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        questionario={selectedQuestionario}
      />
    </div>
  );
};

export default QuestionariosTab;
