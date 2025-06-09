import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contractTemplatesApi } from '../../hooks/contract/api/contractTemplates';
import { ContractTemplate } from '../../hooks/contract/types';
import { toast } from 'sonner';
import {
  TemplateFormFields,
  ContentEditors,
  VariablesPanel,
  TemplatePreview,
  generateBasicTemplate
} from './components';
import { templateSchema, TemplateFormData } from './types';

interface ContractTemplateEditorProps {
  template?: ContractTemplate;
  onSave: (template: ContractTemplate) => void;
  onCancel: () => void;
}

const ContractTemplateEditor = ({ template, onSave, onCancel }: ContractTemplateEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
  const cssContent = watch('css_content');

  const handleGenerateBasicTemplate = () => {
    const { html, css } = generateBasicTemplate();
    setValue('html_content', html);
    setValue('css_content', css);
    toast.success('Template básico inserido!');
  };

  const handleVariableClick = (variable: string) => {
    const currentContent = htmlContent || '';
    setValue('html_content', currentContent + ' ' + variable);
  };

  const onSubmit = async (data: TemplateFormData) => {
    setIsLoading(true);
    try {
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
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {template ? 'Editar Template' : 'Novo Template'} de Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <TemplateFormFields
              register={register}
              errors={errors}
              isNew={!template}
              onGenerateBasicTemplate={handleGenerateBasicTemplate}
            />

            {/* Editor Content */}
            <ContentEditors register={register} errors={errors} />

            {/* Variáveis Disponíveis */}
            <VariablesPanel onVariableClick={handleVariableClick} />

            {/* Preview */}
            <TemplatePreview htmlContent={htmlContent} cssContent={cssContent} />

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

export default ContractTemplateEditor;
