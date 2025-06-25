
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Plus, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import QuestionariosGroupedView from './QuestionariosGroupedView';
import ModalPersonalizacao from './ModalPersonalizacao';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import { usePersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';
import { Questionario } from '../types/questionario';

const QuestionariosManager = () => {
  const [selectedLinkPublico, setSelectedLinkPublico] = useState<string | null>(null);
  const [isPersonalizacaoOpen, setIsPersonalizacaoOpen] = useState(false);
  const { toast } = useToast();
  const { questionarios, isLoading, refetch } = useQuestionarios();
  const { buscarPersonalizacao, salvarPersonalizacao } = usePersonalizacaoIA();

  const handleHistoriaIA = async (linkPublico: string) => {
    setSelectedLinkPublico(linkPublico);
    setIsPersonalizacaoOpen(true);
  };

  const handleViewAnswers = (questionario: Questionario) => {
    // Implementar visualização de respostas
    console.log('Ver respostas:', questionario);
  };

  const handleViewHistory = (questionario: Questionario) => {
    // Implementar visualização de história
    console.log('Ver história:', questionario);
  };

  const handleEdit = (questionario: Questionario) => {
    // Implementar edição
    console.log('Editar:', questionario);
  };

  const handleExport = (questionario: Questionario) => {
    // Implementar exportação
    console.log('Exportar:', questionario);
  };

  const handleDelete = (questionario: Questionario) => {
    // Implementar exclusão
    console.log('Excluir:', questionario);
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
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Questionários</CardTitle>
              <CardDescription>
                Visualize e gerencie os questionários preenchidos pelos casais
              </CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Questionário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questionarios && questionarios.length > 0 ? (
            <QuestionariosGroupedView
              questionarios={questionarios}
              onViewAnswers={handleViewAnswers}
              onViewHistory={handleViewHistory}
              onEdit={handleEdit}
              onExport={handleExport}
              onDelete={handleDelete}
              onHistoriaIA={handleHistoriaIA}
              isExporting={false}
            />
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Nenhum questionário encontrado.
              </p>
              <Button variant="outline">
                Criar Primeiro Questionário
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPersonalizacaoOpen} onOpenChange={setIsPersonalizacaoOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Personalizar História IA
            </DialogTitle>
          </DialogHeader>
          {selectedLinkPublico && (
            <ModalPersonalizacao
              linkPublico={selectedLinkPublico}
              onClose={() => setIsPersonalizacaoOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionariosManager;
