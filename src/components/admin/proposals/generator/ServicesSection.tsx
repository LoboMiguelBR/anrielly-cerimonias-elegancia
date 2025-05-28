
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
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const includedServices = services.filter(service => service.included);

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
              className={`flex items-start space-x-4 p-4 border rounded-lg ${
                service.included ? 'bg-green-50 border-green-200' : 'bg-gray-50'
              }`}
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
                    placeholder="Ex: Cerimônia de Casamento"
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
                    placeholder="Descrição detalhada do serviço..."
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
            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <p className="text-lg font-medium">Nenhum serviço adicionado ainda</p>
                <p className="text-sm">Clique em "Novo Serviço" para começar a adicionar os serviços incluídos na proposta.</p>
              </div>
            </div>
          )}
        </div>

        {/* Resumo dos Serviços Incluídos */}
        {includedServices.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Serviços Incluídos na Proposta ({includedServices.length})
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2">
                {includedServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-900">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-blue-700 mt-1">{service.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cálculos Financeiros */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Valores da Proposta</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-price">Valor Total (R$) *</Label>
              <Input
                id="total-price"
                type="number"
                step="0.01"
                min="0"
                value={totalPrice}
                onChange={(e) => onTotalPriceChange(e.target.value)}
                disabled={isLoading}
                required
                placeholder="0,00"
              />
              <p className="text-xs text-gray-500">
                Valor: {formatCurrency(totalPrice)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (R$)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={(e) => onDiscountChange(e.target.value)}
                disabled={isLoading}
                placeholder="0,00"
              />
              <p className="text-xs text-gray-500">
                Desconto: {formatCurrency(discount)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="final-price">Valor Final</Label>
              <Input
                id="final-price"
                value={formatCurrency(finalPrice)}
                disabled
                className="bg-green-50 border-green-200 text-green-800 font-semibold"
              />
              <p className="text-xs text-green-600 font-medium">
                Este será o valor apresentado na proposta
              </p>
            </div>
          </div>
          
          {/* Resumo Financeiro */}
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Valor Base:</span>
                <span className="font-medium">{formatCurrency(totalPrice)}</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto:</span>
                  <span className="font-medium">- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-purple-900 border-t pt-2">
                <span>Total Final:</span>
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesSection;
