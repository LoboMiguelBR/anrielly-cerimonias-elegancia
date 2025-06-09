
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TemplateFormData } from '../types';

interface ContentEditorsProps {
  register: UseFormRegister<TemplateFormData>;
  errors: FieldErrors<TemplateFormData>;
}

const ContentEditors: React.FC<ContentEditorsProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* HTML Content */}
      <div>
        <Label htmlFor="html_content">Conteúdo do Contrato (HTML)</Label>
        <Textarea
          id="html_content"
          {...register('html_content')}
          placeholder="Digite o conteúdo do contrato em HTML..."
          className="min-h-[400px] font-mono text-sm mt-2"
        />
        {errors.html_content && (
          <p className="text-sm text-red-600 mt-1">{errors.html_content.message}</p>
        )}
      </div>

      {/* CSS Content */}
      <div>
        <Label htmlFor="css_content">CSS Personalizado</Label>
        <Textarea
          id="css_content"
          {...register('css_content')}
          placeholder="Estilos CSS personalizados..."
          className="min-h-[400px] font-mono text-sm mt-2"
        />
      </div>
    </div>
  );
};

export default ContentEditors;
