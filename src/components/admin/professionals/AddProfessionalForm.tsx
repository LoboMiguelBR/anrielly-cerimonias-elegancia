
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { Professional } from '@/hooks/useProfessionals';

interface AddProfessionalFormData {
  name: string;
  category: string;
  document?: string;
  phone: string;
  email: string;
  instagram?: string;
  website?: string;
  city: string;
  notes?: string;
}

interface AddProfessionalFormProps {
  onSuccess: (professional: Professional) => void;
  onSubmit: (data: AddProfessionalFormData & { tags: string[] }) => Promise<Professional>;
}

const CATEGORIES = [
  'cerimonialista',
  'fotografo',
  'videomaker',
  'decorador',
  'florista',
  'musico',
  'dj',
  'buffet',
  'doces',
  'bolo',
  'convites',
  'locacao',
  'transporte',
  'seguranca',
  'outro'
];

const CATEGORY_LABELS: { [key: string]: string } = {
  'cerimonialista': 'Cerimonialista',
  'fotografo': 'Fotógrafo',
  'videomaker': 'Videomaker',
  'decorador': 'Decorador',
  'florista': 'Florista',
  'musico': 'Músico',
  'dj': 'DJ',
  'buffet': 'Buffet',
  'doces': 'Doces',
  'bolo': 'Bolo',
  'convites': 'Convites',
  'locacao': 'Locação',
  'transporte': 'Transporte',
  'seguranca': 'Segurança',
  'outro': 'Outro'
};

const AddProfessionalForm = ({ onSuccess, onSubmit }: AddProfessionalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { isMobile } = useMobileLayout();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<AddProfessionalFormData>();

  const category = watch('category');

  const handleCategoryChange = (value: string) => {
    setValue('category', value);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFormSubmit = async (data: AddProfessionalFormData) => {
    setIsSubmitting(true);
    
    try {
      const professional = await onSubmit({ ...data, tags });
      onSuccess(professional);
      reset();
      setTags([]);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Nome é obrigatório' })}
            placeholder="Nome do profissional"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email é obrigatório',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email inválido'
              }
            })}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...register('phone', { required: 'Telefone é obrigatório' })}
            placeholder="(11) 99999-9999"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            {...register('city', { required: 'Cidade é obrigatória' })}
            placeholder="Cidade, Estado"
          />
          {errors.city && (
            <p className="text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">CNPJ/CPF</Label>
          <Input
            id="document"
            {...register('document')}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            {...register('instagram')}
            placeholder="@usuario"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register('website')}
            placeholder="https://exemplo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Adicionar tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1"
          />
          <Button type="button" onClick={addTag} variant="outline">
            Adicionar
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Informações adicionais sobre o profissional..."
          rows={3}
        />
      </div>

      <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-end'}`}>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setTags([]);
          }}
          className={isMobile ? 'w-full' : ''}
        >
          Limpar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`bg-rose-500 hover:bg-rose-600 text-white ${isMobile ? 'w-full' : ''}`}
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Profissional'}
        </Button>
      </div>
    </form>
  );
};

export default AddProfessionalForm;
