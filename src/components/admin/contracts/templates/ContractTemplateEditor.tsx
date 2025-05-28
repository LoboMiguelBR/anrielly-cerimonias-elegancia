
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contractTemplatesApi } from '../../hooks/contract/api/contractTemplates';
import { ContractTemplate } from '../../hooks/contract/types';
import { getAvailableVariables } from '@/utils/contractVariables';
import AIButton from '../../shared/AIButton';
import { toast } from 'sonner';

const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  html_content: z.string().min(1, 'Conteúdo é obrigatório'),
  css_content: z.string().optional(),
  is_default: z.boolean().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface ContractTemplateEditorProps {
  template?: ContractTemplate;
  onSave: (template: ContractTemplate) => void;
  onCancel: () => void;
}

const ContractTemplateEditor = ({ template, onSave, onCancel }: ContractTemplateEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableVariables] = useState(getAvailableVariables());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template ? {
      name: template.name,
      description: template.description || '',
      html_content: template.html_content,
      css_content: template.css_content || '',
      is_default: template.is_default || false,
    } : {
      name: '',
      description: '',
      html_content: '',
      css_content: '',
      is_default: false,
    }
  });

  const htmlContent = watch('html_content');

  const handleAISuggestion = (content: string) => {
    setValue('html_content', content);
    toast.success('Conteúdo sugerido inserido!');
  };

  const onSubmit = async (data: TemplateFormData) => {
    setIsLoading(true);
    try {
      // Ensure required fields are present and create properly typed payload
      const templatePayload = {
        name: data.name,
        html_content: data.html_content,
        description: data.description || '',
        css_content: data.css_content || '',
        is_default: data.is_default || false,
      };

      let result;
      if (template) {
        result = await contractTemplatesApi.updateContractTemplate(template.id, templatePayload);
      } else {
        result = await contractTemplatesApi.createContractTemplate(templatePayload);
      }
      onSave(result);
      toast.success(`Template ${template ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {template ? 'Editar Template' : 'Novo Template'} de Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Contrato Padrão de Casamento"
                  className="h-12 md:h-10"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Descrição opcional do template"
                  className="h-12 md:h-10"
                />
              </div>
            </div>

            {/* Conteúdo HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="html_content">Conteúdo do Contrato (HTML)</Label>
                <AIButton
                  type="contract_text"
                  context={{ 
                    event_type: 'casamento',
                    template_type: 'contrato_padrao'
                  }}
                  onSuggestion={handleAISuggestion}
                  label="✨ Gerar com IA"
                  variant="outline"
                />
              </div>
              <Textarea
                id="html_content"
                {...register('html_content')}
                placeholder="Digite o conteúdo do contrato em HTML..."
                className="min-h-[300px] font-mono text-sm"
              />
              {errors.html_content && (
                <p className="text-sm text-red-600 mt-1">{errors.html_content.message}</p>
              )}
            </div>

            {/* CSS */}
            <div>
              <Label htmlFor="css_content">CSS Personalizado (Opcional)</Label>
              <Textarea
                id="css_content"
                {...register('css_content')}
                placeholder="Estilos CSS personalizados..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Variáveis Disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variáveis Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                  {availableVariables.map((variable) => (
                    <code
                      key={variable}
                      className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        const currentContent = htmlContent || '';
                        setValue('html_content', currentContent + ' ' + variable);
                      }}
                    >
                      {variable}
                    </code>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Clique em uma variável para adicioná-la ao conteúdo
                </p>
              </CardContent>
            </Card>

            {/* Preview */}
            {htmlContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border rounded p-4 bg-white prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Botões de ação */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (template ? 'Atualizar' : 'Criar')} Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTemplateEditor;
