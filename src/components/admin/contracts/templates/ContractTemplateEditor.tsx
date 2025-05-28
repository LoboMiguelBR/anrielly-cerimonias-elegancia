
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
  const cssContent = watch('css_content');

  const generateBasicTemplate = () => {
    const basicHtml = `
<div class="contract-document">
  <header class="contract-header">
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p class="contract-subtitle">Cerimonial de {TIPO_EVENTO}</p>
  </header>

  <section class="contract-parties">
    <h2>PARTES CONTRATANTES</h2>
    <div class="party">
      <h3>CONTRATANTE:</h3>
      <p><strong>Nome:</strong> {NOME_CLIENTE}</p>
      <p><strong>Email:</strong> {EMAIL_CLIENTE}</p>
      <p><strong>Telefone:</strong> {TELEFONE_CLIENTE}</p>
    </div>
    
    <div class="party">
      <h3>CONTRATADA:</h3>
      <p><strong>Nome:</strong> Anrielly Gomes - Mestre de Cerimônia</p>
      <p><strong>Telefone:</strong> (24) 99268-9947</p>
      <p><strong>Email:</strong> contato@anriellygomes.com.br</p>
    </div>
  </section>

  <section class="contract-details">
    <h2>DETALHES DO EVENTO</h2>
    <p><strong>Tipo de Evento:</strong> {TIPO_EVENTO}</p>
    <p><strong>Data:</strong> {DATA_EVENTO}</p>
    <p><strong>Local:</strong> {LOCAL_EVENTO}</p>
    <p><strong>Valor Total:</strong> {VALOR_TOTAL}</p>
  </section>

  <section class="contract-terms">
    <h2>TERMOS E CONDIÇÕES</h2>
    <ol>
      <li>A contratada se compromete a prestar os serviços de cerimonial conforme acordado.</li>
      <li>O pagamento será realizado conforme condições especificadas.</li>
      <li>Este contrato possui validade jurídica conforme Lei nº 14.063/2020.</li>
    </ol>
  </section>

  <footer class="contract-footer">
    <p>Data: {DATA_VERSAO} | Versão: {VERSAO}</p>
  </footer>
</div>
    `.trim();

    const basicCss = `
.contract-document {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  color: #333;
}

.contract-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 20px;
}

.contract-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
}

.contract-subtitle {
  color: #d4af37;
  font-size: 16px;
  font-style: italic;
}

.contract-parties, .contract-details, .contract-terms {
  margin-bottom: 25px;
}

.contract-parties h2, .contract-details h2, .contract-terms h2 {
  color: #2c3e50;
  border-bottom: 1px solid #bdc3c7;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 18px;
}

.party {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border-left: 4px solid #d4af37;
}

.party h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

.contract-terms ol {
  padding-left: 20px;
}

.contract-terms li {
  margin-bottom: 10px;
}

.contract-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #bdc3c7;
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .contract-document {
    padding: 15px;
  }
  
  .contract-header h1 {
    font-size: 20px;
  }
  
  .party {
    padding: 10px;
  }
}
    `.trim();

    setValue('html_content', basicHtml);
    setValue('css_content', basicCss);
    toast.success('Template básico inserido!');
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
          <CardTitle className="flex items-center justify-between">
            <span>{template ? 'Editar Template' : 'Novo Template'} de Contrato</span>
            {!template && (
              <Button
                type="button"
                variant="outline"
                onClick={generateBasicTemplate}
                className="text-sm"
              >
                📝 Gerar Template Básico
              </Button>
            )}
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

            {/* Editor Content in Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HTML Content */}
              <div>
                <Label htmlFor="html_content">Conteúdo do Contrato (HTML)</Label>
                <Textarea
                  id="html_content"
                  {...register('html_content')}
                  placeholder="Digite o conteúdo do contrato em HTML..."
                  className="min-h-[400px] font-mono text-sm mt-2"
                />
                {errors.html_content && (
                  <p className="text-sm text-red-600 mt-1">{errors.html_content.message}</p>
                )}
              </div>

              {/* CSS Content */}
              <div>
                <Label htmlFor="css_content">CSS Personalizado</Label>
                <Textarea
                  id="css_content"
                  {...register('css_content')}
                  placeholder="Estilos CSS personalizados..."
                  className="min-h-[400px] font-mono text-sm mt-2"
                />
              </div>
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
                      className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
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
                  Clique em uma variável para adicioná-la ao conteúdo HTML
                </p>
              </CardContent>
            </Card>

            {/* Preview */}
            {htmlContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview do Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded p-4 bg-white max-h-96 overflow-auto">
                    <style dangerouslySetInnerHTML={{ __html: cssContent || '' }} />
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

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
