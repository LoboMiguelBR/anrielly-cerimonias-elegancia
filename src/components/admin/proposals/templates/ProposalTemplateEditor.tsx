
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proposalTemplatesApi, ProposalTemplateData } from '../../hooks/proposal/api/proposalTemplates';
import { toast } from 'sonner';
import {
  ProposalTemplateFormFields,
  ProposalContentEditors,
  ProposalVariablesPanel,
  ProposalTemplatePreview,
  generateBasicProposalTemplate
} from './components';
import { proposalTemplateSchema, ProposalTemplateFormData } from './types';

interface ProposalTemplateEditorProps {
  template?: ProposalTemplateData;
  onSave: (template: ProposalTemplateData) => void;
  onCancel: () => void;
}

const ProposalTemplateEditor = ({ template, onSave, onCancel }: ProposalTemplateEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProposalTemplateFormData>({
    resolver: zodResolver(proposalTemplateSchema),
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
  const cssContent = watch('css_content');

  const handleGenerateBasicTemplate = () => {
    const { html, css } = generateBasicProposalTemplate();
    setValue('html_content', html);
    setValue('css_content', css);
    toast.success('Template básico inserido!');
  };

  const handleVariableClick = (variable: string) => {
    const currentContent = htmlContent || '';
    setValue('html_content', currentContent + ' ' + variable);
  };

  const onSubmit = async (data: ProposalTemplateFormData) => {
    setIsLoading(true);
    try {
      const templatePayload = {
        name: data.name,
        html_content: data.html_content,
        description: data.description || '',
        css_content: data.css_content || '',
        is_default: data.is_default || false,
        variables: {} // Will be populated automatically
      };

      let result;
      if (template) {
        result = await proposalTemplatesApi.updateProposalTemplate(template.id, templatePayload);
      } else {
        result = await proposalTemplatesApi.createProposalTemplate(templatePayload);
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
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {template ? 'Editar Template' : 'Novo Template'} de Proposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <ProposalTemplateFormFields
              register={register}
              errors={errors}
              isNew={!template}
              onGenerateBasicTemplate={handleGenerateBasicTemplate}
            />

            {/* Editor Content */}
            <ProposalContentEditors register={register} errors={errors} />

            {/* Variáveis Disponíveis */}
            <ProposalVariablesPanel onVariableClick={handleVariableClick} />

            {/* Preview */}
            <ProposalTemplatePreview htmlContent={htmlContent} cssContent={cssContent} />

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="order-1 sm:order-2"
              >
                {isLoading ? 'Salvando...' : (template ? 'Atualizar' : 'Criar')} Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalTemplateEditor;
