import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateHtmlEditor } from './html-editor/TemplateHtmlEditor';
import { TemplateVersionHistory } from './TemplateVersionHistory';
import { TemplateCategories } from './TemplateCategories';
import { Star, Save, Settings, History, Eye } from 'lucide-react';

interface EnhancedTemplateEditorProps {
  templateId?: string;
  onSave?: (template: any) => void;
  onCancel?: () => void;
}

export const EnhancedTemplateEditor: React.FC<EnhancedTemplateEditorProps> = ({
  templateId,
  onSave,
  onCancel,
}) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'general',
    tags: [] as string[],
    html_content: '',
    css_content: '',
    is_default: false,
  });

  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'wedding', label: 'Casamento' },
    { value: 'corporate', label: 'Corporativo' },
    { value: 'birthday', label: 'Aniversário' },
    { value: 'graduation', label: 'Formatura' },
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !templateData.tags.includes(newTag.trim())) {
      setTemplateData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      // Save template with enhanced metadata
      console.log('Saving enhanced template:', templateData);
      onSave?.(templateData);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {templateId ? 'Editar Template' : 'Novo Template'}
          </h1>
          <p className="text-muted-foreground">
            Editor avançado de templates com versionamento e categorização
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">
            <Settings className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="metadata">
            <Star className="h-4 w-4 mr-2" />
            Metadados
          </TabsTrigger>
          <TabsTrigger value="versions" disabled={!templateId}>
            <History className="h-4 w-4 mr-2" />
            Versões
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <TemplateHtmlEditor
            onSave={async (template) => {
              handleSave();
              return true;
            }}
            onCancel={onCancel}
          />
        </TabsContent>

        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={templateData.category} onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={templateData.description}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva quando usar este template"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Adicionar
                  </Button>
                </div>
                {templateData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {templateData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          {templateId && (
            <TemplateVersionHistory 
              templateId={templateId}
              onRestore={(version) => {
                setTemplateData(prev => ({
                  ...prev,
                  html_content: version.html_content,
                  css_content: version.css_content,
                }));
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white min-h-[400px]">
                <div dangerouslySetInnerHTML={{ __html: templateData.html_content }} />
                <style dangerouslySetInnerHTML={{ __html: templateData.css_content }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};