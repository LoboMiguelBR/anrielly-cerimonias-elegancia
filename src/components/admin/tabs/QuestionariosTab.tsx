
import { useQuestionarios } from '@/hooks/useQuestionarios';
import QuestionariosTableEnhanced from '../questionarios/QuestionariosTableEnhanced';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QuestionarioCreateFormEnhanced from './components/QuestionarioCreateFormEnhanced';
import { useState } from 'react';

const QuestionariosTab = () => {
  const { questionarios, isLoading, refetch } = useQuestionarios();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleQuestionarioCreated = () => {
    setShowCreateDialog(false);
    refetch();
  };

  const stats = {
    total: questionarios?.length || 0,
    rascunho: questionarios?.filter(q => q.status === 'rascunho').length || 0,
    enviados: questionarios?.filter(q => q.status === 'enviado').length || 0,
    respondidos: questionarios?.filter(q => q.status === 'respondido').length || 0,
    processados: questionarios?.filter(q => q.status === 'processado').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Questionários</h2>
          <p className="text-gray-600">Gerencie questionários dos noivos e suas respostas</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Questionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Questionário</DialogTitle>
            </DialogHeader>
            <QuestionarioCreateFormEnhanced onSuccess={handleQuestionarioCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Questionários criados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.rascunho}</div>
            <p className="text-xs text-muted-foreground">Ainda não enviados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enviados}</div>
            <p className="text-xs text-muted-foreground">Aguardando resposta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.respondidos}</div>
            <p className="text-xs text-muted-foreground">Com respostas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.processados}</div>
            <p className="text-xs text-muted-foreground">História gerada</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Questionários */}
      <QuestionariosTableEnhanced 
        questionarios={questionarios || []} 
        isLoading={isLoading} 
        onRefresh={refetch} 
      />
    </div>
  );
};

export default QuestionariosTab;
