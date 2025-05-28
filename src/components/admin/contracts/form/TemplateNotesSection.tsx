
import React from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, MessageSquare } from 'lucide-react';
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
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          Template e Observações
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="template_id" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Template do Contrato
          </Label>
          <Select 
            onValueChange={(value) => setValue('template_id', value)}
            disabled={isLoadingTemplates}
          >
            <SelectTrigger className="min-h-[48px] border-neutral-300 focus:ring-blue-500">
              <SelectValue placeholder={isLoadingTemplates ? "Carregando..." : "Selecione um template"} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{template.name}</span>
                    {template.is_default && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                        Padrão
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="border-neutral-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Observações adicionais sobre o contrato, condições especiais, etc..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateNotesSection;
