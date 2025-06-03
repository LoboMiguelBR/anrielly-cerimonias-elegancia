
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ServiceCard from './ServiceCard';
import { Service } from '@/hooks/useServices';

interface ServicesListProps {
  services: Service[];
  onDragEnd: (result: any) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onDragEnd,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum serviço cadastrado ainda.</p>
        <p className="text-sm mt-1">Clique em "Novo Serviço" para começar.</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="services">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ServicesList;
