
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface AddLeadFormData {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  message?: string;
}

interface AddLeadFormProps {
  onSuccess: () => void;
}

const AddLeadForm = ({ onSuccess }: AddLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isMobile } = useMobileLayout();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<AddLeadFormData>();

  const eventType = watch('event_type');

  const handleEventTypeChange = (value: string) => {
    setValue('event_type', value);
  };

  const onSubmit = async (data: AddLeadFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          event_type: data.event_type,
          event_date: data.event_date || null,
          event_location: data.event_location,
          message: data.message || null,
          status: 'aguardando'
        }]);

      if (error) throw error;

      toast.success('Lead cadastrado com sucesso!');
      reset();
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao cadastrar lead:', error);
      toast.error('Erro ao cadastrar lead: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Nome é obrigatório' })}
            placeholder="Nome do cliente"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
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
          <Label htmlFor="event_type">Tipo de Evento *</Label>
          <Select value={eventType} onValueChange={handleEventTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casamento">Casamento</SelectItem>
              <SelectItem value="aniversario">Aniversário</SelectItem>
              <SelectItem value="formatura">Formatura</SelectItem>
              <SelectItem value="corporativo">Evento Corporativo</SelectItem>
              <SelectItem value="batizado">Batizado</SelectItem>
              <SelectItem value="debutante">Festa de 15 Anos</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.event_type && (
            <p className="text-sm text-red-600">{errors.event_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">Data do Evento</Label>
          <Input
            id="event_date"
            type="date"
            {...register('event_date')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_location">Local do Evento *</Label>
          <Input
            id="event_location"
            {...register('event_location', { required: 'Local é obrigatório' })}
            placeholder="Cidade, Estado"
          />
          {errors.event_location && (
            <p className="text-sm text-red-600">{errors.event_location.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Observações</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Informações adicionais sobre o evento..."
          rows={3}
        />
      </div>

      <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-end'}`}>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className={isMobile ? 'w-full' : ''}
        >
          Limpar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`bg-rose-500 hover:bg-rose-600 text-white ${isMobile ? 'w-full' : ''}`}
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Lead'}
        </Button>
      </div>
    </form>
  );
};

export default AddLeadForm;
