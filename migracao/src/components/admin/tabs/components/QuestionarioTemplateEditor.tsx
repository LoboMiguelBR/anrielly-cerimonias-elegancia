
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuestionarioTemplateEditorProps {
  template: any;
  onSuccess: () => void;
  onClose: () => void;
}

const QuestionarioTemplateEditor = ({ template, onSuccess, onClose }: QuestionarioTemplateEditorProps) => {
  const [templateData, setTemplateData] = useState(template || {});
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template?.id) {
      loadTemplateData();
    }
  }, [template]);

  const loadTemplateData = async () => {
    try {
      // Carregar seções
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('questionario_template_secoes')
        .select('*')
        .eq('template_id', template.id)
        .order('ordem');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Carregar perguntas
      const { data: questionsData, error: questionsError } = await supabase
        .from('questionario_template_perguntas')
        .select('*')
        .eq('template_id', template.id)
        .order('ordem');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do template:', error);
      toast.error('Erro ao carregar dados do template');
    }
  };

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
        ordem: sections.length,
        ativo: true
      };

      const { data, error } = await supabase
        .from('questionario_template_secoes')
        .insert([newSection])
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, data]);
      toast.success('Seção adicionada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar seção:', error);
      toast.error('Erro ao adicionar seção: ' + error.message);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) return;

    try {
      const { error } = await supabase
        .from('questionario_template_secoes')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(sections.filter(s => s.id !== sectionId));
      setQuestions(questions.filter(q => q.secao_id !== sectionId));
      toast.success('Seção excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir seção:', error);
      toast.error('Erro ao excluir seção: ' + error.message);
    }
  };

  const addQuestion = async (sectionId: string) => {
    try {
      const sectionQuestions = questions.filter(q => q.secao_id === sectionId);
      const newQuestion = {
        template_id: template.id,
        secao_id: sectionId,
        texto: 'Nova pergunta',
        tipo_resposta: 'texto_longo',
        ordem: sectionQuestions.length,
        obrigatoria: false,
        ativo: true
      };

      const { data, error } = await supabase
        .from('questionario_template_perguntas')
        .insert([newQuestion])
        .select()
        .single();

      if (error) throw error;

      setQuestions([...questions, data]);
      toast.success('Pergunta adicionada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar pergunta:', error);
      toast.error('Erro ao adicionar pergunta: ' + error.message);
    }
  };

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
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div>
                        <CardTitle className="text-base">{section.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">Ordem: {section.ordem}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.ativo && <Badge variant="outline">Ativo</Badge>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {section.descricao && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600">{section.descricao}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-4">
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{section.titulo}</CardTitle>
                    <Button 
                      onClick={() => addQuestion(section.id)} 
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
                    {questions
                      .filter(q => q.secao_id === section.id)
                      .map((question) => (
                        <div key={question.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{question.texto}</span>
                            {question.obrigatoria && <Badge variant="destructive" className="text-xs">Obrigatória</Badge>}
                          </div>
                          <Badge variant="secondary" className="text-xs">{question.tipo_resposta}</Badge>
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
    </div>
  );
};

export default QuestionarioTemplateEditor;
