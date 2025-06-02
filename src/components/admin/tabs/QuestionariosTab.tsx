import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, List, LayoutGrid } from "lucide-react";
import { useQuestionarios } from "@/hooks/useQuestionarios";
import { useQuestionarioActions } from "@/hooks/useQuestionarioActions";
import { useQuestionarioExport } from "@/hooks/useQuestionarioExport";
import QuestionarioCreateFormEnhanced from "./components/QuestionarioCreateFormEnhanced";
import QuestionariosTableEnhanced from "../questionarios/QuestionariosTableEnhanced";
import QuestionariosGroupedView from "./components/QuestionariosGroupedView";
import QuestionarioAnswersModal from "./components/QuestionarioAnswersModal";
import EditQuestionarioModal from "../questionarios/EditQuestionarioModal";
import QuestionarioHistoryModal from "./components/QuestionarioHistoryModal";
import { Questionario } from '@/components/admin/tabs/types/questionario';

const QuestionariosTab = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    setShowEditModal(true);
  };

  const handleViewHistory = (questionario: Questionario) => {
    setSelectedQuestionario(questionario);
    setShowHistoryModal(true);
  };

  const handleExport = async (questionario: Questionario) => {
    await exportQuestionario(questionario);
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
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando questionários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Questionários dos Noivos</h2>
          <p className="text-gray-600">Gerencie os questionários e visualize as respostas</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle de Visualização */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grouped' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grouped')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Agrupado
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
          </div>

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
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preenchidos</CardTitle>
              <Badge variant="default">{stats.preenchidos}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.preenchidos}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
              <Badge variant="secondary">{stats.rascunhos}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.rascunhos}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <Badge variant="outline">{stats.concluidos}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.concluidos}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conteúdo Principal */}
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

      {/* Modais */}
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

      <EditQuestionarioModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={handleEditSuccess}
        questionario={selectedQuestionario}
      />

      <QuestionarioHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        questionario={selectedQuestionario}
      />
    </div>
  );
};

export default QuestionariosTab;
