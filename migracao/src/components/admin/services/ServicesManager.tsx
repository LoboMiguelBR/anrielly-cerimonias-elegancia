
import React, { useState } from 'react';
import { useServices, Service } from '@/hooks/useServices';
import { useServiceForm } from './hooks/useServiceForm';
import ServicesHeader from './components/ServicesHeader';
import ServicesList from './components/ServicesList';
import ServiceEditDialog from './components/ServiceEditDialog';
import LoadingState from './components/LoadingState';

const ServicesManager = () => {
  const { services, isLoading, createService, updateService, deleteService, toggleServiceActive, reorderServices } = useServices();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const { formData, updateFormField, resetForm } = useServiceForm();

  const handleResetForm = () => {
    resetForm(services.length);
  };

  const handleCreate = async () => {
    try {
      await createService({
        ...formData,
        order_index: services.length + 1
      });
      setIsCreateDialogOpen(false);
      handleResetForm();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    updateFormField('title', service.title);
    updateFormField('description', service.description);
    updateFormField('icon', service.icon);
    updateFormField('is_active', service.is_active);
    updateFormField('order_index', service.order_index);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    
    try {
      await updateService(editingService.id, formData);
      setIsEditDialogOpen(false);
      setEditingService(null);
      handleResetForm();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este serviço?')) {
      await deleteService(id);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderServices(items);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ServicesHeader
        isCreateDialogOpen={isCreateDialogOpen}
        onCreateDialogChange={setIsCreateDialogOpen}
        formData={formData}
        onFieldChange={updateFormField}
        onCreate={handleCreate}
        onResetForm={handleResetForm}
      />

      <ServicesList
        services={services}
        onDragEnd={handleDragEnd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={toggleServiceActive}
      />

      <ServiceEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onFieldChange={updateFormField}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ServicesManager;
