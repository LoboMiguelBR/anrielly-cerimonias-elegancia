
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import ClientProfessionalSelector from './ClientProfessionalSelector';
import ServicesSection from './ServicesSection';
import TemplateSelector from '../templates/TemplateSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MobileProposalStepsProps {
  formData: any;
  selectedClientType: string;
  selectedClientId: string;
  totalPrice: string;
  discount: string;
  finalPrice: string;
  selectedTemplate: any;
  quoteRequests: any[];
  professionals: any[];
  isLoading: boolean;
  isSaving: boolean;
  setSelectedClientType: (type: string) => void;
  setSelectedClientId: (id: string) => void;
  setTotalPrice: (price: string) => void;
  setDiscount: (discount: string) => void;
  setSelectedTemplate: (template: any) => void;
  handleFormChange: (field: string, value: string) => void;
  handleServiceToggle: (serviceId: string) => void;
  handleServiceUpdate: (serviceId: string, updates: any) => void;
  handleAddService: () => void;
  handleRemoveService: (serviceId: string) => void;
  onSubmit: () => Promise<void>;
  onPreview: () => void;
  onClose?: () => void;
}

const MobileProposalSteps: React.FC<MobileProposalStepsProps> = ({
  formData,
  selectedClientType,
  selectedClientId,
  totalPrice,
  discount,
  finalPrice,
  selectedTemplate,
  quoteRequests,
  professionals,
  isLoading,
  isSaving,
  setSelectedClientType,
  setSelectedClientId,
  setTotalPrice,
  setDiscount,
  setSelectedTemplate,
  handleFormChange,
  handleServiceToggle,
  handleServiceUpdate,
  handleAddService,
  handleRemoveService,
  onSubmit,
  onPreview,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'template',
      title: 'Template',
      description: 'Escolha o modelo da proposta'
    },
    {
      id: 'client',
      title: 'Cliente',
      description: 'Dados do cliente'
    },
    {
      id: 'event',
      title: 'Evento',
      description: 'Informações do evento'
    },
    {
      id: 'services',
      title: 'Serviços',
      description: 'Serviços e valores'
    },
    {
      id: 'terms',
      title: 'Termos',
      description: 'Condições finais'
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Template
        return !!selectedTemplate;
      case 1: // Cliente
        return !!(formData.client_name && formData.client_email);
      case 2: // Evento
        return !!(formData.event_type && formData.event_location);
      case 3: // Serviços
        return formData.services.length > 0;
      case 4: // Termos
        return !!(formData.payment_terms && formData.validity_date);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClientFormChange = (field: string, value: string) => {
    handleFormChange(field as any, value);
  };

  // Create wrapper functions to match the expected service handler signatures
  const handleServiceToggleWrapper = (index: number, included: boolean) => {
    handleServiceToggle(index.toString());
  };

  const handleServiceUpdateWrapper = (index: number, updates: any) => {
    handleServiceUpdate(index.toString(), updates);
  };

  const handleRemoveServiceWrapper = (index: number) => {
    handleRemoveService(index.toString());
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Template
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Selecionar Template</Label>
              <p className="text-sm text-gray-600 mb-3">
                Escolha o modelo visual da sua proposta
              </p>
            </div>
            <TemplateSelector 
              selectedTemplateId={selectedTemplate?.id} 
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        );

      case 1: // Cliente
        return (
          <ClientProfessionalSelector
            quoteRequests={quoteRequests}
            professionals={professionals}
            selectedClientType={selectedClientType as 'lead' | 'professional' | ''}
            selectedClientId={selectedClientId}
            formData={{
              client_name: formData.client_name,
              client_email: formData.client_email,
              client_phone: formData.client_phone,
              event_type: formData.event_type,
              event_date: formData.event_date,
              event_location: formData.event_location
            }}
            onClientTypeChange={setSelectedClientType}
            onClientSelect={setSelectedClientId}
            onFormDataChange={handleClientFormChange}
            isLoading={isLoading}
            disabled={false}
          />
        );

      case 2: // Evento
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="event_type" className="text-base font-medium">Tipo do Evento *</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => handleFormChange('event_type', e.target.value)}
                className="h-12 text-base mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="event_date" className="text-base font-medium">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date || ''}
                onChange={(e) => handleFormChange('event_date', e.target.value)}
                className="h-12 text-base mt-2"
              />
            </div>
            <div>
              <Label htmlFor="event_location" className="text-base font-medium">Local do Evento *</Label>
              <Input
                id="event_location"
                value={formData.event_location}
                onChange={(e) => handleFormChange('event_location', e.target.value)}
                className="h-12 text-base mt-2"
                required
              />
            </div>
          </div>
        );

      case 3: // Serviços
        return (
          <ServicesSection
            services={formData.services}
            totalPrice={totalPrice}
            discount={discount}
            finalPrice={finalPrice}
            onServiceToggle={handleServiceToggleWrapper}
            onServiceUpdate={handleServiceUpdateWrapper}
            onAddService={handleAddService}
            onRemoveService={handleRemoveServiceWrapper}
            onTotalPriceChange={setTotalPrice}
            onDiscountChange={setDiscount}
            isLoading={isLoading}
          />
        );

      case 4: // Termos
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_terms" className="text-base font-medium">Condições de Pagamento *</Label>
              <Textarea
                id="payment_terms"
                value={formData.payment_terms}
                onChange={(e) => handleFormChange('payment_terms', e.target.value)}
                placeholder="Ex: 50% na assinatura e 50% 5 dias antes do evento"
                className="mt-2 min-h-[80px] text-base"
                required
              />
            </div>
            <div>
              <Label htmlFor="validity_date" className="text-base font-medium">Data de Validade *</Label>
              <Input
                id="validity_date"
                type="date"
                value={formData.validity_date}
                onChange={(e) => handleFormChange('validity_date', e.target.value)}
                className="h-12 text-base mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes" className="text-base font-medium">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Observações adicionais sobre a proposta..."
                className="mt-2 min-h-[80px] text-base"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Nova Proposta</h2>
          <span className="text-sm text-gray-600">
            {currentStep + 1} de {steps.length}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Current step info */}
        <div className="mt-3">
          <h3 className="font-medium text-gray-900">{steps[currentStep].title}</h3>
          <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardContent className="p-4">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-white p-4 space-y-3">
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPreview}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isSaving || !canProceed()}
              >
                {isSaving ? 'Salvando...' : 'Criar Proposta'}
              </Button>
            </div>
          )}
        </div>

        {/* Action buttons for final step */}
        {currentStep === steps.length - 1 && (
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProposalSteps;
