
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateMetaFieldsProps {
  name: string;
  description: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TemplateMetaFields: React.FC<TemplateMetaFieldsProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="template-name">Nome do Template</Label>
          <Input
            id="template-name"
            value={name}
            onChange={onNameChange}
            placeholder="Nome do template"
            className={!name ? "border-red-300 focus:border-red-500" : ""}
          />
          {!name && (
            <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>
          )}
        </div>
        
        <div className="flex-1">
          <Label htmlFor="template-description">Descrição</Label>
          <Input
            id="template-description"
            value={description || ''}
            onChange={onDescriptionChange}
            placeholder="Descrição breve do template"
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateMetaFields;
