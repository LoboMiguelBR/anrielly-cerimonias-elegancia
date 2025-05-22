
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TemplateHtmlEditor from '../html-editor/TemplateHtmlEditor';
import { HtmlTemplateData } from '../html-editor/types';

interface TemplateEditorDialogProps {
  editingTemplate: HtmlTemplateData | null;
  onSave: (template: HtmlTemplateData) => Promise<boolean>;
  onCancel: () => void;
}

const TemplateEditorDialog: React.FC<TemplateEditorDialogProps> = ({ 
  editingTemplate, 
  onSave, 
  onCancel 
}) => {
  return (
    <DialogContent className="max-w-screen-xl max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {editingTemplate ? `Editar Template: ${editingTemplate.name}` : 'Novo Template HTML'}
        </DialogTitle>
      </DialogHeader>
      <TemplateHtmlEditor
        initialTemplate={editingTemplate || undefined}
        onSave={onSave}
        onCancel={onCancel}
      />
    </DialogContent>
  );
};

export default TemplateEditorDialog;
