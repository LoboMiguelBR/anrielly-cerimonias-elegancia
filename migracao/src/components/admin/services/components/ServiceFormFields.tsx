
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ServiceFormData, IconOption } from '../types';

interface ServiceFormFieldsProps {
  formData: ServiceFormData;
  iconOptions: IconOption[];
  onFieldChange: (field: keyof ServiceFormData, value: any) => void;
}

const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  formData,
  iconOptions,
  onFieldChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="Ex: Casamentos personalizados"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Descrição do serviço..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="icon">Ícone</Label>
        <Select value={formData.icon} onValueChange={(value) => onFieldChange('icon', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">Serviço ativo</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onFieldChange('is_active', checked)}
        />
      </div>
    </div>
  );
};

export default ServiceFormFields;
