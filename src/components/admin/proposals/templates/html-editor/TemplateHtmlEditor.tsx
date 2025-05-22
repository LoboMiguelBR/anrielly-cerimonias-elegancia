import React, { useState, useEffect, useRef } from 'react';
import { HtmlTemplateData, TemplateEditorProps } from './types';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchHtmlTemplateById, saveHtmlTemplate, updateHtmlTemplate } from './templateHtmlService';
import { defaultTemplateVariables } from './variableUtils';
import CodeEditor from './CodeEditor';
import TemplatePreview from './TemplatePreview';
import VariablesPanel from './VariablesPanel';
import AssetsPanel from './AssetsPanel';
import { Loader2, Save, ArrowLeftCircle, Eye } from 'lucide-react';

export const TemplateHtmlEditor: React.FC<TemplateEditorProps> = ({ 
  initialTemplate,
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [template, setTemplate] = useState<HtmlTemplateData | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);

        if (initialTemplate) {
          setTemplate(initialTemplate);
          setHtmlContent(initialTemplate.htmlContent);
          setCssContent(initialTemplate.cssContent || '');
        } else {
          // Create a new empty template
          const emptyTemplate: HtmlTemplateData = {
            id: 'new',
            name: 'Novo Template',
            description: '',
            htmlContent: '<div class="template">\n  <!-- Conteúdo do template aqui -->\n</div>',
            cssContent: '.template {\n  font-family: Arial, sans-serif;\n}',
            variables: {},
            isDefault: false
          };
          setTemplate(emptyTemplate);
          setHtmlContent(emptyTemplate.htmlContent);
          setCssContent(emptyTemplate.cssContent || '');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Erro ao carregar template');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [initialTemplate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (template) {
      setTemplate({ ...template, name: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (template) {
      setTemplate({ ...template, description: e.target.value });
    }
  };

  const handleHtmlChange = (value: string) => {
    setHtmlContent(value);
    if (template) {
      setTemplate({ ...template, htmlContent: value });
    }
  };

  const handleCssChange = (value: string) => {
    setCssContent(value);
    if (template) {
      setTemplate({ ...template, cssContent: value });
    }
  };

  const handleSave = async () => {
    if (!template) return;

    try {
      setIsSaving(true);
      
      // Ensure we have complete template data
      const templateToSave: HtmlTemplateData = {
        ...template,
        htmlContent,
        cssContent
      };
      
      let success = false;
      
      // If we have onSave callback, use it
      if (onSave) {
        success = await onSave(templateToSave);
      } else {
        // Otherwise use our service directly
        if (template.id === 'new') {
          // Create new template
          const newId = await saveHtmlTemplate({
            name: template.name,
            description: template.description,
            htmlContent,
            cssContent,
            variables: template.variables,
            isDefault: template.isDefault
          });
          
          success = !!newId;
          
          if (success && newId) {
            setTemplate({
              ...templateToSave,
              id: newId
            });
          }
        } else {
          // Update existing template
          success = await updateHtmlTemplate(template.id, {
            name: template.name,
            description: template.description,
            htmlContent,
            cssContent,
            variables: template.variables,
            isDefault: template.isDefault
          });
        }
      }
      
      if (success) {
        toast.success('Template salvo com sucesso!');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const renderVariableSection = (variableName: string) => {
    const variables = defaultTemplateVariables.filter(v => v.category === variableName);
    if (variables.length === 0) return null;
    
    return (
      <div key={variableName} className="mb-4">
        <h3 className="text-sm font-medium mb-2 capitalize">{variableName}</h3>
        <div className="flex flex-wrap gap-1">
          {variables.map(variable => (
            <Button 
              key={`${variable.category}.${variable.name}`}
              variant="outline" 
              size="sm"
              onClick={() => {/* Insert variable functionality will be implemented later */}}
              className="text-xs"
            >
              {variable.name}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2">Carregando editor...</span>
      </div>
    );
  }

  return (
    <div className="template-html-editor">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {template?.id === 'new' ? 'Criar Novo Template' : 'Editar Template'}
          </h2>
          <p className="text-gray-500">
            Editor HTML para templates de propostas
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={onCancel}
            className="flex items-center"
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            onClick={togglePreviewMode}
            variant={previewMode ? "default" : "outline"}
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Editando" : "Preview"}
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Template
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="template-name">Nome do Template</Label>
            <Input
              id="template-name"
              value={template?.name || ''}
              onChange={handleNameChange}
              placeholder="Nome do template"
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="template-description">Descrição</Label>
            <Input
              id="template-description"
              value={template?.description || ''}
              onChange={(e) => handleDescriptionChange(e as any)}
              placeholder="Descrição breve do template"
            />
          </div>
        </div>
      </div>

      {previewMode ? (
        <div className="border rounded-lg shadow-sm p-4 bg-white">
          <TemplatePreview htmlContent={htmlContent} cssContent={cssContent} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="border rounded-lg p-0 min-h-[500px] shadow-sm">
                <CodeEditor
                  language="html"
                  value={htmlContent}
                  onChange={handleHtmlChange}
                />
              </TabsContent>
              
              <TabsContent value="css" className="border rounded-lg p-0 min-h-[500px] shadow-sm">
                <CodeEditor
                  language="css"
                  value={cssContent}
                  onChange={handleCssChange}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Variáveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[250px] overflow-y-auto">
                <VariablesPanel onInsertVariable={(category, variable) => {
                  // This will be implemented in a follow-up
                  console.log(`Insert variable: ${category}.${variable}`);
                }} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Imagens e Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <AssetsPanel onSelectAsset={(asset) => {
                  // This will be implemented in a follow-up
                  console.log('Selected asset:', asset);
                }} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateHtmlEditor;
