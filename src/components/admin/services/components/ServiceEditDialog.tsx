
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceFormFields from './ServiceFormFields';
import { ServiceFormData } from '../types';
import { iconOptions } from '../constants';

interface ServiceEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  onFieldChange: (field: keyof ServiceFormData, value: any) => void;
  onSubmit: () => void;
}

const ServiceEditDialog: React.FC<ServiceEditDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFieldChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        
        <ServiceFormFields
          formData={formData}
          iconOptions={iconOptions}
          onFieldChange={onFieldChange}
        />
        
        <div className="flex gap-2 pt-4">
          <Button onClick={onSubmit} className="flex-1">
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditDialog;
