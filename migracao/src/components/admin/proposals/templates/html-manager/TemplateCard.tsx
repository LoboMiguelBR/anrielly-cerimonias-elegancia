
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { HtmlTemplateData } from '../html-editor/types';

interface TemplateCardProps {
  template: HtmlTemplateData;
  onEdit: (template: HtmlTemplateData) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: HtmlTemplateData) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  return (
    <Card key={template.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{template.name}</span>
          {template.isDefault && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Padrão
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="h-32 mb-4 overflow-hidden border rounded bg-gray-50 text-xs text-gray-500">
          <div className="p-2 overflow-hidden" style={{ maxHeight: '100%' }}>
            <pre className="overflow-hidden whitespace-pre-wrap">
              {template.htmlContent.length > 500 
                ? `${template.htmlContent.substring(0, 500)}...` 
                : template.htmlContent}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-xs text-gray-500">
            {new Date(template.createdAt || '').toLocaleDateString('pt-BR')}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDuplicate(template)}
              title="Duplicar template"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(template)}
              title="Editar template"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(template.id)}
              title="Excluir template"
              disabled={template.isDefault}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
