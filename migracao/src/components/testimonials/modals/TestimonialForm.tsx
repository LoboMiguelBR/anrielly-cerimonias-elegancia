
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TestimonialFormData {
  name: string;
  role: string;
  quote: string;
  email: string;
}

interface TestimonialFormProps {
  formData: TestimonialFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TestimonialForm = ({ formData, onChange }: TestimonialFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Seu nome"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="seu.email@exemplo.com"
          required
        />
        <p className="text-xs text-gray-500">
          Seu email não será exibido publicamente. Será usado apenas para notificações.
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="role">Identificação <span className="text-gray-400 text-xs">(opcional)</span></Label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          onChange={onChange}
          placeholder="Ex: Noiva em Volta Redonda, Debutante em Barra Mansa"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="quote">Seu Depoimento *</Label>
        <Textarea
          id="quote"
          name="quote"
          value={formData.quote}
          onChange={onChange}
          placeholder="Compartilhe sua experiência..."
          rows={4}
          required
        />
      </div>
    </div>
  );
};

export default TestimonialForm;
