
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2 } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProposalTemplateFormData } from '../types';

interface ProposalTemplateFormFieldsProps {
  register: UseFormRegister<ProposalTemplateFormData>;
  errors: FieldErrors<ProposalTemplateFormData>;
  isNew: boolean;
  onGenerateBasicTemplate: () => void;
}

const ProposalTemplateFormFields = ({ 
  register, 
  errors, 
  isNew, 
  onGenerateBasicTemplate 
}: ProposalTemplateFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Template *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ex: Template Moderno"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Descrição do template"
        />
      </div>

      <div className="md:col-span-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="is_default" 
            {...register('is_default')}
          />
          <Label htmlFor="is_default">Definir como template padrão</Label>
        </div>

        {isNew && (
          <Button
            type="button"
            variant="outline"
            onClick={onGenerateBasicTemplate}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Gerar Template Básico
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProposalTemplateFormFields;
