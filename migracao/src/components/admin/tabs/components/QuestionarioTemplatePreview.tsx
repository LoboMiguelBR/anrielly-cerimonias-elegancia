
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

interface QuestionarioTemplatePreviewProps {
  template: any;
  onClose: () => void;
}

const QuestionarioTemplatePreview = ({ template, onClose }: QuestionarioTemplatePreviewProps) => {
  const [sections, setSections] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        .eq('ativo', true)
        .order('ordem');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Carregar perguntas
      const { data: questionsData, error: questionsError } = await supabase
        .from('questionario_template_perguntas')
        .select('*')
        .eq('template_id', template.id)
        .eq('ativo', true)
        .order('ordem');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do template:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      'texto_curto': 'Texto Curto',
      'texto_longo': 'Texto Longo',
      'multipla_escolha': 'Múltipla Escolha',
      'unica_escolha': 'Escolha Única',
      'numero': 'Número',
      'data': 'Data',
      'email': 'Email',
      'telefone': 'Telefone',
      'url': 'URL'
    };
    return types[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Header do Template */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">{template.nome}</h2>
        <p className="text-gray-600">{template.tipo_evento}</p>
        {template.descricao && (
          <p className="text-sm text-gray-500 mt-2">{template.descricao}</p>
        )}
        <div className="flex justify-center gap-2 mt-3">
          {template.is_default && <Badge variant="default">Padrão</Badge>}
          {template.ativo && <Badge variant="outline">Ativo</Badge>}
          <Badge variant="secondary">{template.categoria}</Badge>
        </div>
      </div>

      {/* Seções e Perguntas */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionQuestions = questions.filter(q => q.secao_id === section.id);
          
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{section.titulo}</CardTitle>
                    {section.descricao && (
                      <p className="text-sm text-gray-600 mt-1">{section.descricao}</p>
                    )}
                  </div>
                  <Badge variant="outline">{sectionQuestions.length} pergunta(s)</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {sectionQuestions.map((question, index) => (
                    <div key={question.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {index + 1}. {question.texto}
                            {question.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          {question.placeholder && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              Placeholder: {question.placeholder}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Badge variant="secondary" className="text-xs">
                            {getQuestionTypeLabel(question.tipo_resposta)}
                          </Badge>
                          {question.obrigatoria && (
                            <Badge variant="destructive" className="text-xs">Obrigatória</Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Opções de resposta para múltipla escolha */}
                      {(question.tipo_resposta === 'multipla_escolha' || question.tipo_resposta === 'unica_escolha') && 
                       question.opcoes_resposta && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Opções:</p>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(question.opcoes_resposta) ? question.opcoes_resposta : []).map((opcao: string, optIndex: number) => (
                              <Badge key={optIndex} variant="outline" className="text-xs">
                                {opcao}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {sectionQuestions.length === 0 && (
                    <p className="text-gray-500 text-sm italic">Nenhuma pergunta nesta seção</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estatísticas */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Estatísticas do Template</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total de Seções:</span>
            <span className="font-medium ml-2">{sections.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Total de Perguntas:</span>
            <span className="font-medium ml-2">{questions.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Perguntas Obrigatórias:</span>
            <span className="font-medium ml-2">{questions.filter(q => q.obrigatoria).length}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose}>Fechar Preview</Button>
      </div>
    </div>
  );
};

export default QuestionarioTemplatePreview;
