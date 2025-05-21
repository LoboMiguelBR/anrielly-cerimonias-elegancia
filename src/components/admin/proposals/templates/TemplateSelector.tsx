
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { fetchTemplates } from './shared/templateService';
import { ProposalTemplateData } from './shared/types';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplateEditor } from './TemplateEditor';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (templateData: ProposalTemplateData) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplateId = 'default',
  onSelectTemplate
}) => {
  const [templates, setTemplates] = useState<ProposalTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProposalTemplateData | null>(null);

  // Load available templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      const availableTemplates = await fetchTemplates();
      setTemplates(availableTemplates);
      
      // Set the selected template or default
      if (selectedTemplateId) {
        const selected = availableTemplates.find(t => t.id === selectedTemplateId);
        if (selected) {
          onSelectTemplate(selected);
        } else if (availableTemplates.length > 0) {
          onSelectTemplate(availableTemplates[0]);
        }
      }
      
      setIsLoading(false);
    };
    
    loadTemplates();
  }, [selectedTemplateId, onSelectTemplate]);

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    const selected = templates.find(t => t.id === value);
    if (selected) {
      onSelectTemplate(selected);
    }
  };

  // Open template editor
  const handleEditTemplate = () => {
    const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    setEditingTemplate(currentTemplate);
    setShowEditor(true);
  };

  // Create new template
  const handleNewTemplate = () => {
    const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    // Clone the current template as a starting point but clear the ID
    setEditingTemplate({
      ...currentTemplate,
      id: '',
      name: 'Novo Template'
    });
    setShowEditor(true);
  };

  // After template is saved, refresh the list
  const handleTemplateSaved = async () => {
    setShowEditor(false);
    setEditingTemplate(null);
    const refreshedTemplates = await fetchTemplates();
    setTemplates(refreshedTemplates);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <Select 
          value={selectedTemplateId} 
          onValueChange={handleTemplateChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleEditTemplate}
        title="Editar template"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNewTemplate} 
        title="Novo template"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
      
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate?.id ? `Editar Template: ${editingTemplate?.name}` : 'Novo Template'}
            </DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <TemplateEditor 
              template={editingTemplate} 
              onSaved={handleTemplateSaved}
              onCancel={() => setShowEditor(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateSelector;
