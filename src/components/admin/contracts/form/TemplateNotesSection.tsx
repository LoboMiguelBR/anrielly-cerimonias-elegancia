
import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractFormData } from '../../hooks/contract/types';

interface TemplateNotesSectionProps {
  register: UseFormRegister<ContractFormData>;
  setValue: UseFormSetValue<ContractFormData>;
  templates: any[];
  isLoadingTemplates: boolean;
}

const TemplateNotesSection: React.FC<TemplateNotesSectionProps> = ({
  register,
  setValue,
  templates,
  isLoadingTemplates
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Template e Observações</h3>
      
      <div>
        <Label htmlFor="template_id">Template do Contrato</Label>
        <Select 
          onValueChange={(value) => setValue('template_id', value)}
          disabled={isLoadingTemplates}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingTemplates ? "Carregando..." : "Selecione um template"} />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} {template.is_default && "(Padrão)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          rows={3}
          placeholder="Observações adicionais sobre o contrato..."
        />
      </div>
    </div>
  );
};

export default TemplateNotesSection;
