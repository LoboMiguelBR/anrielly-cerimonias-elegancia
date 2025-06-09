
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import ServiceFormFields from './ServiceFormFields';
import { ServiceFormData } from '../types';
import { iconOptions } from '../constants';

interface ServiceCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  onFieldChange: (field: keyof ServiceFormData, value: any) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const ServiceCreateDialog: React.FC<ServiceCreateDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFieldChange,
  onSubmit,
  onReset
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onReset} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Serviço</DialogTitle>
        </DialogHeader>
        
        <ServiceFormFields
          formData={formData}
          iconOptions={iconOptions}
          onFieldChange={onFieldChange}
        />
        
        <div className="flex gap-2 pt-4">
          <Button onClick={onSubmit} className="flex-1">
            Criar Serviço
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCreateDialog;
