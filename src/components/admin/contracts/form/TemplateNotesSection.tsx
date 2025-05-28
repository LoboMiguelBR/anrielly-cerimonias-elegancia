
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FileText, StickyNote, Loader2 } from 'lucide-react';
import { ContractTemplate } from '../../hooks/contract/types';

interface TemplateNotesSectionProps {
  register: any;
  setValue: any;
  templates: ContractTemplate[];
  isLoadingTemplates: boolean;
  selectedTemplateId?: string;
}

const TemplateNotesSection: React.FC<TemplateNotesSectionProps> = ({
  register,
  setValue,
  templates,
  isLoadingTemplates,
  selectedTemplateId
}) => {
  const handleTemplateChange = (value: string) => {
    setValue('template_id', value);
  };

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
          <Label htmlFor="template_id" className="text-sm font-medium text-gray-700 mb-2 block">
            Template do Contrato
          </Label>
          {isLoadingTemplates ? (
            <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Carregando templates...</span>
            </div>
          ) : (
            <Select 
              value={selectedTemplateId || ''} 
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{template.name}</span>
                      {template.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Padrão
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {templates.length === 0 && !isLoadingTemplates && (
            <p className="text-sm text-gray-500 mt-1">
              Nenhum template disponível. Configure templates na seção de Templates.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <StickyNote className="h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Adicione observações ou informações especiais sobre este contrato..."
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateNotesSection;
