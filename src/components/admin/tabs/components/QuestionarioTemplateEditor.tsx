
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, GripVertical } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuestionarioTemplateStructure } from '@/hooks/useQuestionarioTemplateStructure';
import TemplateSecaoEditor from './TemplateSecaoEditor';
import TemplatePerguntaModal from './TemplatePerguntaModal';

interface QuestionarioTemplateEditorProps {
  template: any;
  onSuccess: () => void;
  onClose: () => void;
}

const QuestionarioTemplateEditor = ({ template, onSuccess, onClose }: QuestionarioTemplateEditorProps) => {
  const [templateData, setTemplateData] = useState(template || {});
  const [loading, setLoading] = useState(false);
  const [perguntaModalOpen, setPerguntaModalOpen] = useState(false);
  const [selectedPergunta, setSelectedPergunta] = useState<any>(null);
  const [selectedSecaoId, setSelectedSecaoId] = useState<string | null>(null);

  const { 
    structure, 
    isLoading, 
    updateTemplateSecao,
    updateTemplatePergunta,
    deleteTemplatePergunta,
    addTemplatePergunta,
    deleteTemplateSecao
  } = useQuestionarioTemplateStructure(template?.id);

  const handleSaveTemplate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('questionario_templates')
        .update(templateData)
        .eq('id', template.id);

      if (error) throw error;

      toast.success('Template atualizado com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast.error('Erro ao salvar template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSection = async () => {
    try {
      const newSection = {
        template_id: template.id,
        titulo: 'Nova Seção',
        descricao: '',
        ordem: structure?.secoes.length || 0,
        ativo: true
      };

      const { error } = await supabase
        .from('questionario_template_secoes')
        .insert([newSection]);

      if (error) throw error;

      toast.success('Seção adicionada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar seção:', error);
      toast.error('Erro ao adicionar seção: ' + error.message);
    }
  };

  const handleAddPergunta = (secaoId: string) => {
    setSelectedSecaoId(secaoId);
    setSelectedPergunta(null);
    setPerguntaModalOpen(true);
  };

  const handleEditPergunta = (pergunta: any) => {
    setSelectedSecaoId(pergunta.secao_id);
    setSelectedPergunta(pergunta);
    setPerguntaModalOpen(true);
  };

  const handleSavePergunta = async (perguntaId: string | null, perguntaData: any) => {
    if (perguntaId) {
      // Atualizar pergunta existente
      return await updateTemplatePergunta(perguntaId, perguntaData);
    } else {
      // Criar nova pergunta
      const perguntasNaSecao = structure?.perguntas.filter(p => p.secao_id === selectedSecaoId) || [];
      perguntaData.ordem = perguntasNaSecao.length;
      return await addTemplatePergunta(selectedSecaoId!, perguntaData);
    }
  };

  const handleDeletePergunta = async (perguntaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await deleteTemplatePergunta(perguntaId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando estrutura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="questions">Perguntas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Template</Label>
              <Input
                id="nome"
                value={templateData.nome || ''}
                onChange={(e) => setTemplateData({ ...templateData, nome: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="tipo_evento">Tipo do Evento</Label>
              <Input
                id="tipo_evento"
                value={templateData.tipo_evento || ''}
                onChange={(e) => setTemplateData({ ...templateData, tipo_evento: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={templateData.descricao || ''}
              onChange={(e) => setTemplateData({ ...templateData, descricao: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={templateData.is_default || false}
                onCheckedChange={(checked) => setTemplateData({ ...templateData, is_default: checked })}
              />
              <Label htmlFor="is_default">Template Padrão</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={templateData.ativo !== false}
                onCheckedChange={(checked) => setTemplateData({ ...templateData, ativo: checked })}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Seções do Template</h4>
            <Button onClick={addSection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Seção
            </Button>
          </div>
          
          <div className="space-y-3">
            {structure?.secoes.map((section) => (
              <TemplateSecaoEditor
                key={section.id}
                secao={section}
                onUpdate={updateTemplateSecao}
                onDelete={deleteTemplateSecao}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-4">
          <div className="space-y-4">
            {structure?.secoes.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{section.titulo}</CardTitle>
                    <Button 
                      onClick={() => handleAddPergunta(section.id)} 
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Pergunta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {structure?.perguntas
                      .filter(q => q.secao_id === section.id)
                      .map((question) => (
                        <div key={question.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                          <div className="flex items-center gap-3 flex-1">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{question.texto}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {question.tipo_resposta.replace('_', ' ')}
                                </Badge>
                                {question.obrigatoria && (
                                  <Badge variant="destructive" className="text-xs">Obrigatória</Badge>
                                )}
                                {!question.ativo && (
                                  <Badge variant="outline" className="text-xs">Inativa</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPergunta(question)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePergunta(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSaveTemplate} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Template'}
        </Button>
      </div>

      <TemplatePerguntaModal
        isOpen={perguntaModalOpen}
        onClose={() => setPerguntaModalOpen(false)}
        pergunta={selectedPergunta}
        secaoId={selectedSecaoId || ''}
        templateId={template.id}
        onSave={handleSavePergunta}
      />
    </div>
  );
};

export default QuestionarioTemplateEditor;
