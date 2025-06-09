
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProposalTemplateFormData } from '../types';

interface ProposalContentEditorsProps {
  register: UseFormRegister<ProposalTemplateFormData>;
  errors: FieldErrors<ProposalTemplateFormData>;
}

const ProposalContentEditors = ({ register, errors }: ProposalContentEditorsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="html_content">Conteúdo HTML *</Label>
        <Textarea
          id="html_content"
          {...register('html_content')}
          placeholder="Digite o HTML do template aqui..."
          className="min-h-[300px] font-mono text-sm"
        />
        {errors.html_content && (
          <p className="text-sm text-red-600">{errors.html_content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="css_content">CSS (Opcional)</Label>
        <Textarea
          id="css_content"
          {...register('css_content')}
          placeholder="Digite o CSS do template aqui..."
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default ProposalContentEditors;
