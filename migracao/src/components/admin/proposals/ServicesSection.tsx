
import React from 'react';
import { Button } from "@/components/ui/button";

interface ServicesSectionProps {
  services: Array<{ name: string; included: boolean }>;
  customService: string;
  handleServiceChange: (index: number, checked: boolean) => void;
  handleCustomServiceChange: (value: string) => void;
  handleCustomServiceAdd: () => void;
  isLoading: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  customService,
  handleServiceChange,
  handleCustomServiceChange,
  handleCustomServiceAdd,
  isLoading
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Serviços Incluídos</label>
      <div className="space-y-2">
        {services.map((service, index) => (
          <div key={index} className="flex items-center">
            <input 
              type="checkbox" 
              id={`service-${index}`} 
              className="mr-2"
              checked={service.included}
              onChange={(e) => handleServiceChange(index, e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor={`service-${index}`}>{service.name}</label>
          </div>
        ))}
        <div className="mt-2 flex gap-2">
          <input 
            type="text" 
            placeholder="Adicionar serviço personalizado" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
            value={customService}
            onChange={(e) => handleCustomServiceChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomServiceAdd()}
            disabled={isLoading}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCustomServiceAdd}
            disabled={isLoading || customService.trim() === ""}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
