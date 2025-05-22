
import React from 'react';
import { HtmlTemplateData } from '../html-editor/types';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: HtmlTemplateData[];
  onEdit: (template: HtmlTemplateData) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: HtmlTemplateData) => void;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ 
  templates, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
