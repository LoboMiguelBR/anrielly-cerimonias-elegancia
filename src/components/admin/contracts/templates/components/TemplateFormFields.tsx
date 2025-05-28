
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateFormData {
  name: string;
  description: string;
  html_content: string;
  css_content: string;
  is_default: boolean;
}

interface TemplateFormFieldsProps {
  register: UseFormRegister<TemplateFormData>;
  errors: FieldErrors<TemplateFormData>;
  isNew: boolean;
  onGenerateBasicTemplate: () => void;
}

const TemplateFormFields: React.FC<TemplateFormFieldsProps> = ({
  register,
  errors,
  isNew,
  onGenerateBasicTemplate
}) => {
  return (
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

      {isNew && (
        <div className="md:col-span-2">
          <Button
            type="button"
            variant="outline"
            onClick={onGenerateBasicTemplate}
            className="w-full sm:w-auto"
          >
            📝 Gerar Template Básico
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateFormFields;
