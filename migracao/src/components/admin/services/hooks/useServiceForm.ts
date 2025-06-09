
import { useState } from 'react';
import { ServiceFormData } from '../types';

export const useServiceForm = (initialData?: Partial<ServiceFormData>) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    icon: initialData?.icon || 'Heart',
    is_active: initialData?.is_active ?? true,
    order_index: initialData?.order_index || 0
  });

  const updateFormField = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = (servicesLength: number = 0) => {
    setFormData({
      title: '',
      description: '',
      icon: 'Heart',
      is_active: true,
      order_index: servicesLength + 1
    });
  };

  return {
    formData,
    setFormData,
    updateFormField,
    resetForm
  };
};
