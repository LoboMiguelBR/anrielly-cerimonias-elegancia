
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';
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
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-rose-500" />
          Dados do Evento
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="event_type" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Tipo de Evento *
            </Label>
            <Input
              id="event_type"
              {...register('event_type')}
              className={`min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500 ${errors.event_type ? 'border-red-500' : ''}`}
              placeholder="Ex: Casamento, Formatura, Aniversário"
            />
            {errors.event_type && (
              <p className="text-red-500 text-sm mt-1">{errors.event_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="event_location" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Local do Evento
            </Label>
            <Input 
              id="event_location" 
              {...register('event_location')} 
              className="min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Nome do local ou endereço"
            />
          </div>

          <div>
            <Label htmlFor="event_date" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data do Evento
            </Label>
            <Input
              id="event_date"
              type="date"
              {...register('event_date')}
              className="min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <Label htmlFor="event_time" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Horário
            </Label>
            <Input
              id="event_time"
              type="time"
              {...register('event_time')}
              className="min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDataSection;
