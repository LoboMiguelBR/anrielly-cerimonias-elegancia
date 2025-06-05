
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, Save, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SectionHtmlEditorProps {
  sectionId: string;
  initialHtml?: string;
  initialVariables?: Record<string, any>;
  sectionType: string;
  onSave?: () => void;
}

const SectionHtmlEditor: React.FC<SectionHtmlEditorProps> = ({
  sectionId,
  initialHtml = '',
  initialVariables = {},
  sectionType,
  onSave
}) => {
  const [htmlTemplate, setHtmlTemplate] = useState(initialHtml);
  const [variables, setVariables] = useState<Record<string, any>>(initialVariables);
  const [newVariableKey, setNewVariableKey] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Função para renderizar preview com variáveis
  const renderPreview = () => {
    let rendered = htmlTemplate;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    setPreviewHtml(rendered);
  };

  // Atualizar preview quando HTML ou variáveis mudarem
  useEffect(() => {
    renderPreview();
  }, [htmlTemplate, variables]);

  // Adicionar nova variável
  const addVariable = () => {
    if (!newVariableKey.trim()) return;
    
    setVariables(prev => ({
      ...prev,
      [newVariableKey]: newVariableValue
    }));
    
    setNewVariableKey('');
    setNewVariableValue('');
  };

  // Remover variável
  const removeVariable = (key: string) => {
    setVariables(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Atualizar valor da variável
  const updateVariable = (key: string, value: any) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Salvar alterações
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('website_sections')
        .update({
          html_template: htmlTemplate,
          variables: variables
        })
        .eq('id', sectionId);

      if (error) throw error;

      toast.success('Seção HTML atualizada com sucesso!');
      onSave?.();
    } catch (error) {
      console.error('Erro ao salvar seção HTML:', error);
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  // Carregar template padrão
  const loadDefaultTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('section_templates')
        .select('*')
        .eq('section_type', sectionType)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHtmlTemplate(data.html_template);
        setVariables(data.default_variables || {});
        toast.success('Template padrão carregado!');
      } else {
        toast.info('Nenhum template padrão encontrado para este tipo de seção');
      }
    } catch (error) {
      console.error('Erro ao carregar template padrão:', error);
      toast.error('Erro ao carregar template padrão');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Editor HTML - {sectionType}
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={loadDefaultTemplate} variant="outline" size="sm">
              Carregar Template
            </Button>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="variables">Variáveis</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-4">
            <div>
              <Label htmlFor="html-template">Template HTML</Label>
              <Textarea
                id="html-template"
                value={htmlTemplate}
                onChange={(e) => setHtmlTemplate(e.target.value)}
                placeholder="Digite o HTML da seção aqui..."
                className="min-h-96 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variáveis no formato: {`{{variavel_nome}}`}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da variável"
                  value={newVariableKey}
                  onChange={(e) => setNewVariableKey(e.target.value)}
                />
                <Input
                  placeholder="Valor"
                  value={newVariableValue}
                  onChange={(e) => setNewVariableValue(e.target.value)}
                />
                <Button onClick={addVariable} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 border rounded">
                    <Badge variant="outline">{key}</Badge>
                    <Input
                      value={String(value)}
                      onChange={(e) => updateVariable(key, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeVariable(key)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {Object.keys(variables).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma variável definida. Adicione variáveis para personalizar o template.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 min-h-96">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div 
                className="bg-white p-4 rounded border"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SectionHtmlEditor;
