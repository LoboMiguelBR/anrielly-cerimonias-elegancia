
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Service } from '../../hooks/proposal/types';

interface ServicesSectionProps {
  services: Service[];
  totalPrice: string;
  discount: string;
  finalPrice: string;
  onServiceToggle: (index: number, included: boolean) => void;
  onServiceUpdate: (index: number, updates: Partial<Service>) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onTotalPriceChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  isLoading?: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  totalPrice,
  discount,
  finalPrice,
  onServiceToggle,
  onServiceUpdate,
  onAddService,
  onRemoveService,
  onTotalPriceChange,
  onDiscountChange,
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Serviços da Proposta
          <Button 
            type="button" 
            onClick={onAddService} 
            size="sm"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de Serviços */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50"
            >
              <Checkbox
                checked={service.included}
                onCheckedChange={(checked) => onServiceToggle(index, !!checked)}
                disabled={isLoading}
                className="mt-1"
              />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`service-name-${index}`}>Nome do Serviço *</Label>
                  <Input
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => onServiceUpdate(index, { name: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-description-${index}`}>Descrição</Label>
                  <Textarea
                    id={`service-description-${index}`}
                    value={service.description || ''}
                    onChange={(e) => onServiceUpdate(index, { description: e.target.value })}
                    disabled={isLoading}
                    rows={2}
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemoveService(index)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {services.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              <p>Nenhum serviço adicionado ainda.</p>
              <p className="text-sm">Clique em "Novo Serviço" para começar.</p>
            </div>
          )}
        </div>

        {/* Cálculos Financeiros */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Valores da Proposta</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-price">Valor Total *</Label>
              <Input
                id="total-price"
                type="number"
                step="0.01"
                value={totalPrice}
                onChange={(e) => onTotalPriceChange(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (R$)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => onDiscountChange(e.target.value)}
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="final-price">Valor Final</Label>
              <Input
                id="final-price"
                value={`R$ ${parseFloat(finalPrice || '0').toFixed(2)}`}
                disabled
                className="bg-green-50 border-green-200 text-green-800 font-semibold"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesSection;
