
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueEventSlug, TIPOS_EVENTO } from '@/utils/eventSlugGenerator';
import { useQuestionarioTemplates } from '@/hooks/useQuestionarioTemplates';

interface QuestionarioCreateFormEnhancedProps {
  onSuccess: () => void;
}

const QuestionarioCreateFormEnhanced = ({ onSuccess }: QuestionarioCreateFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    nome_evento: '',
    tipo_evento: '',
    nome_responsavel: '',
    email: '',
    link_publico: '',
    template_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);
  const { templates } = useQuestionarioTemplates();

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleGenerateSlug = async () => {
    if (!formData.nome_evento.trim()) {
      toast.error('Digite o nome do evento para gerar o link público');
      return;
    }

    setGeneratingSlug(true);
    try {
      const slug = await generateUniqueEventSlug(
        formData.nome_evento,
        formData.tipo_evento || undefined
      );
      setFormData(prev => ({ ...prev, link_publico: slug }));
      toast.success('Link público gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar slug:', error);
      toast.error('Erro ao gerar link público');
    } finally {
      setGeneratingSlug(false);
    }
  };

  // Gerar slug automaticamente quando nome ou tipo do evento mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.nome_evento.trim() && !formData.link_publico) {
        handleGenerateSlug();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.nome_evento, formData.tipo_evento]);

  // Auto-selecionar template padrão quando tipo de evento mudar
  useEffect(() => {
    if (formData.tipo_evento) {
      const defaultTemplate = templates.find(
        t => t.tipo_evento === formData.tipo_evento && t.is_default
      );
      if (defaultTemplate && !formData.template_id) {
        setFormData(prev => ({ ...prev, template_id: defaultTemplate.id }));
      }
    }
  }, [formData.tipo_evento, templates]);

  const copyTemplateStructure = async (questionarioId: string, templateId: string) => {
    try {
      // Buscar seções do template
      const { data: templateSections, error: sectionsError } = await supabase
        .from('questionario_template_secoes')
        .select('*')
        .eq('template_id', templateId)
        .order('ordem');

      if (sectionsError) throw sectionsError;

      // Criar seções no questionário
      for (const templateSection of templateSections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('questionario_secoes')
          .insert({
            questionario_id: questionarioId,
            template_secao_id: templateSection.id,
            titulo: templateSection.titulo,
            descricao: templateSection.descricao,
            ordem: templateSection.ordem,
            ativo: templateSection.ativo
          })
          .select()
          .single();

        if (sectionError) throw sectionError;

        // Buscar perguntas da seção do template
        const { data: templateQuestions, error: questionsError } = await supabase
          .from('questionario_template_perguntas')
          .select('*')
          .eq('secao_id', templateSection.id)
          .order('ordem');

        if (questionsError) throw questionsError;

        // Criar perguntas no questionário
        for (const templateQuestion of templateQuestions) {
          const { error: questionError } = await supabase
            .from('questionario_perguntas')
            .insert({
              questionario_id: questionarioId,
              secao_id: newSection.id,
              template_pergunta_id: templateQuestion.id,
              texto: templateQuestion.texto,
              tipo_resposta: templateQuestion.tipo_resposta,
              placeholder: templateQuestion.placeholder,
              opcoes_resposta: templateQuestion.opcoes_resposta,
              validacoes: templateQuestion.validacoes,
              obrigatoria: templateQuestion.obrigatoria,
              ordem: templateQuestion.ordem,
              ativo: templateQuestion.ativo
            });

          if (questionError) throw questionError;
        }
      }
    } catch (error) {
      console.error('Erro ao copiar estrutura do template:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.link_publico.trim()) {
        toast.error('Link público é obrigatório');
        return;
      }

      if (!formData.template_id) {
        toast.error('Selecione um template para o questionário');
        return;
      }

      const senha = generateRandomPassword();
      
      const { data: questionario, error } = await supabase
        .from('questionarios_noivos')
        .insert([{
          nome_evento: formData.nome_evento,
          tipo_evento: formData.tipo_evento,
          nome_responsavel: formData.nome_responsavel,
          email: formData.email,
          senha_hash: senha,
          link_publico: formData.link_publico,
          template_id: formData.template_id,
          status: 'rascunho'
        }])
        .select()
        .single();

      if (error) throw error;

      // Copiar estrutura do template para o questionário
      await copyTemplateStructure(questionario.id, formData.template_id);

      toast.success('Questionário criado com sucesso!');
      setFormData({ 
        nome_evento: '', 
        tipo_evento: '', 
        nome_responsavel: '', 
        email: '', 
        link_publico: '',
        template_id: ''
      });
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar questionário:', error);
      toast.error('Erro ao criar questionário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Separar templates recomendados dos outros
  const recommendedTemplate = templates.find(
    t => formData.tipo_evento && t.tipo_evento === formData.tipo_evento && t.is_default
  );
  
  const otherTemplates = templates.filter(
    t => !formData.tipo_evento || t.tipo_evento !== formData.tipo_evento || !t.is_default
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome_evento">Nome do Evento *</Label>
        <Input
          id="nome_evento"
          value={formData.nome_evento}
          onChange={(e) => setFormData({ ...formData, nome_evento: e.target.value })}
          placeholder="Ex: Casamento João e Maria"
          required
        />
      </div>

      <div>
        <Label htmlFor="tipo_evento">Tipo do Evento *</Label>
        <Select 
          value={formData.tipo_evento} 
          onValueChange={(value) => setFormData({ ...formData, tipo_evento: value, template_id: '' })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_EVENTO.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="template_id">Template do Questionário *</Label>
        <Select 
          value={formData.template_id} 
          onValueChange={(value) => setFormData({ ...formData, template_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um template" />
          </SelectTrigger>
          <SelectContent>
            {/* Template Recomendado */}
            {recommendedTemplate && (
              <SelectItem key={recommendedTemplate.id} value={recommendedTemplate.id}>
                <div className="flex items-center gap-2">
                  <span>{recommendedTemplate.nome}</span>
                  <Badge variant="default" className="text-xs">Recomendado</Badge>
                </div>
              </SelectItem>
            )}
            
            {/* Separador se houver template recomendado */}
            {recommendedTemplate && otherTemplates.length > 0 && (
              <div className="px-2 py-1">
                <div className="border-t border-gray-200"></div>
                <span className="text-xs text-gray-500 mt-1 block">Outros templates</span>
              </div>
            )}

            {/* Outros Templates */}
            {otherTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <span>{template.nome}</span>
                  <span className="text-xs text-gray-500">Para: {template.tipo_evento}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.tipo_evento && (
          <p className="text-xs text-blue-600 mt-1">
            💡 Sugerimos o template específico para {formData.tipo_evento}, mas você pode escolher qualquer um
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="link_publico">Link Público *</Label>
        <div className="flex gap-2">
          <Input
            id="link_publico"
            value={formData.link_publico}
            onChange={(e) => setFormData({ ...formData, link_publico: e.target.value })}
            placeholder="casamento-joao-maria"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateSlug}
            disabled={generatingSlug || !formData.nome_evento.trim()}
          >
            {generatingSlug ? 'Gerando...' : 'Gerar'}
          </Button>
        </div>
        {formData.link_publico && (
          <p className="text-xs text-gray-500 mt-1">
            URL: {window.location.origin}/questionario/{formData.link_publico}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="nome_responsavel">Nome do Responsável *</Label>
        <Input
          id="nome_responsavel"
          value={formData.nome_responsavel}
          onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
          placeholder="Nome da pessoa responsável"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Criando...' : 'Criar Questionário'}
      </Button>
    </form>
  );
};

export default QuestionarioCreateFormEnhanced;
