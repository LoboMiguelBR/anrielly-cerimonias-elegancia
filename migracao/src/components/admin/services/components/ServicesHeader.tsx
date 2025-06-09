
import React from 'react';
import ServiceCreateDialog from './ServiceCreateDialog';
import { ServiceFormData } from '../types';

interface ServicesHeaderProps {
  isCreateDialogOpen: boolean;
  onCreateDialogChange: (open: boolean) => void;
  formData: ServiceFormData;
  onFieldChange: (field: keyof ServiceFormData, value: any) => void;
  onCreate: () => void;
  onResetForm: () => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  isCreateDialogOpen,
  onCreateDialogChange,
  formData,
  onFieldChange,
  onCreate,
  onResetForm
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">Gerenciar Serviços</h3>
        <p className="text-sm text-gray-600">
          Configure os serviços exibidos no site
        </p>
      </div>
      
      <ServiceCreateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={onCreateDialogChange}
        formData={formData}
        onFieldChange={onFieldChange}
        onSubmit={onCreate}
        onReset={onResetForm}
      />
    </div>
  );
};

export default ServicesHeader;
