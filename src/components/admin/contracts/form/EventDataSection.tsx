
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContractFormData } from '../../hooks/contract/types';

interface EventDataSectionProps {
  register: UseFormRegister<ContractFormData>;
  errors: FieldErrors<ContractFormData>;
}

const EventDataSection: React.FC<EventDataSectionProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados do Evento</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_type">Tipo de Evento *</Label>
          <Input
            id="event_type"
            {...register('event_type')}
            className={errors.event_type ? 'border-red-500' : ''}
          />
          {errors.event_type && (
            <p className="text-red-500 text-sm mt-1">{errors.event_type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="event_date">Data do Evento</Label>
          <Input
            id="event_date"
            type="date"
            {...register('event_date')}
            placeholder="Deixe vazio se não definido"
          />
        </div>

        <div>
          <Label htmlFor="event_time">Horário</Label>
          <Input
            id="event_time"
            type="time"
            {...register('event_time')}
            placeholder="Deixe vazio se não definido"
          />
        </div>

        <div>
          <Label htmlFor="event_location">Local do Evento</Label>
          <Input id="event_location" {...register('event_location')} />
        </div>
      </div>
    </div>
  );
};

export default EventDataSection;
