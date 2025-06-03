
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { Service } from '@/hooks/useServices';
import { iconOptions } from '../constants';

interface ServiceCardProps {
  service: Service;
  index: number;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent className="w-5 h-5" />;
    }
    return iconOptions[0].icon({ className: "w-5 h-5" });
  };

  return (
    <Draggable key={service.id} draggableId={service.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div {...provided.dragHandleProps}>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                </div>
                <div className="flex items-center gap-2">
                  {getIconComponent(service.icon)}
                  <h3 className="text-lg font-medium">{service.title}</h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={service.is_active ? "default" : "secondary"}>
                  {service.is_active ? "Ativo" : "Inativo"}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleActive(service.id, !service.is_active)}
                  >
                    <Switch checked={service.is_active} onChange={() => {}} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{service.description}</p>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ServiceCard;
