import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { useProposalFormEnhanced } from '../hooks/proposal/useProposalFormEnhanced';
import { QuoteRequest } from '../hooks/proposal/types';
import { proposalTemplatesApi } from '../hooks/proposal/api/proposalTemplates';
import type { ProposalTemplateData as ApiProposalTemplateData } from '../hooks/proposal/api/proposalTemplates';
import ClientProfessionalSelector from './generator/ClientProfessionalSelector';
import ServicesSection from './generator/ServicesSection';
import TemplateSelector from './templates/TemplateSelector';
import ProposalPreview from './ProposalPreview';
import MobileProposalSteps from './generator/MobileProposalSteps';
import { supabase } from '@/integrations/supabase/client';
import ProposalActionButtons from './generator/ProposalActionButtons';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
}

interface ProposalGeneratorRefactoredProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
  initialProposalId?: string;
  onClose?: () => void;
}

const ProposalGeneratorRefactored: React.FC<ProposalGeneratorRefactoredProps> = ({
  quoteRequests,
  quoteIdFromUrl,
  initialProposalId,
  onClose
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [templates, setTemplates] = useState<ApiProposalTemplateData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { isMobile } = useMobileLayout();

  const {
    formData,
    selectedClientType,
    selectedClientId,
    totalPrice,
    discount,
    finalPrice,
    selectedTemplate,
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
    handleSubmit,
    proposal,
    isEditMode
  } = useProposalFormEnhanced(initialProposalId, quoteRequests, professionals);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: professionalsData, error: profError } = await supabase
          .from('professionals')
          .select('id, name, email, phone, category, city');
        
        if (profError) {
          console.error('Error loading professionals:', profError);
        } else {
          setProfessionals(professionalsData || []);
        }

        const templatesData = await proposalTemplatesApi.fetchProposalTemplates();
        setTemplates(templatesData);
        
        if (!selectedTemplate && templatesData.length > 0) {
          const defaultTemplate = templatesData.find(t => t.is_default) || templatesData[0];
          setSelectedTemplate(defaultTemplate);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [selectedTemplate, setSelectedTemplate]);

  useEffect(() => {
    if (quoteIdFromUrl && !selectedClientId && !isEditMode) {
      setSelectedClientType('lead');
      setSelectedClientId(quoteIdFromUrl);
      
      const selectedQuote = quoteRequests.find(q => q.id === quoteIdFromUrl);
      if (selectedQuote) {
        handleFormChange('client_name', selectedQuote.name);
        handleFormChange('client_email', selectedQuote.email || '');
        handleFormChange('client_phone', selectedQuote.phone || '');
        handleFormChange('event_type', selectedQuote.event_type || selectedQuote.eventType || '');
        handleFormChange('event_date', selectedQuote.event_date || '');
        handleFormChange('event_location', selectedQuote.event_location || '');
      }
    }
  }, [quoteIdFromUrl, selectedClientId, isEditMode, setSelectedClientType, setSelectedClientId, quoteRequests, handleFormChange]);

  const handleTemplateChange = (template: ApiProposalTemplateData) => {
    setSelectedTemplate(template);
    handleFormChange('template_id', template.id);
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handleSubmit();
  };

  const handleSaveProposal = async (): Promise<boolean> => {
    const success = await handleSubmit();
    return success;
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClientFormChange = (field: string, value: string) => {
    handleFormChange(field as any, value);
  };

  const isFormValid = !!(
    formData.client_name &&
    formData.client_email &&
    formData.event_type &&
    formData.event_location &&
    formData.payment_terms &&
    formData.validity_date &&
    formData.services.length > 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    const proposalData = {
      ...formData,
      id: proposal?.id,
      total_price: parseFloat(finalPrice) || 0,
      template_id: selectedTemplate?.id || null
    };

    const previewTemplate = selectedTemplate ? {
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      colors: {
        primary: '#8A2BE2',
        secondary: '#F2AE30',
        accent: '#E57373',
        text: '#333333',
        background: '#FFFFFF'
      },
      fonts: {
        title: 'Playfair Display, serif',
        body: 'Inter, sans-serif'
      },
      logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
      showQrCode: true,
      showTestimonials: true,
      showDifferentials: true,
      showAboutSection: true
    } : undefined;

    return (
      <ProposalPreview
        proposal={proposalData as any}
        template={previewTemplate}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  if (isMobile) {
    return (
      <MobileProposalSteps
        formData={formData}
        selectedClientType={selectedClientType}
        selectedClientId={selectedClientId}
        totalPrice={totalPrice}
        discount={discount}
        finalPrice={finalPrice}
        selectedTemplate={selectedTemplate}
        quoteRequests={quoteRequests}
        professionals={professionals}
        isLoading={isLoading}
        isSaving={isSaving}
        setSelectedClientType={setSelectedClientType}
        setSelectedClientId={setSelectedClientId}
        setTotalPrice={setTotalPrice}
        setDiscount={setDiscount}
        setSelectedTemplate={setSelectedTemplate}
        handleFormChange={handleFormChange}
        handleServiceToggle={handleServiceToggle}
        handleServiceUpdate={handleServiceUpdate}
        handleAddService={handleAddService}
        handleRemoveService={handleRemoveService}
        onSubmit={handleFormSubmit}
        onPreview={handlePreview}
        onClose={onClose}
      />
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template da Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="template">Selecionar Template</Label>
            <TemplateSelector 
              selectedTemplateId={selectedTemplate?.id} 
              onSelectTemplate={handleTemplateChange}
            />
          </div>
        </CardContent>
      </Card>

      <ClientProfessionalSelector
        quoteRequests={quoteRequests}
        professionals={professionals}
        selectedClientType={selectedClientType}
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
        disabled={isEditMode}
      />

      <Card>
        <CardHeader>
          <CardTitle>Dados do Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_type">Tipo do Evento *</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => handleFormChange('event_type', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_date">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date || ''}
                onChange={(e) => handleFormChange('event_date', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="event_location">Local do Evento *</Label>
              <Input
                id="event_location"
                value={formData.event_location}
                onChange={(e) => handleFormChange('event_location', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ServicesSection
        services={formData.services}
        totalPrice={totalPrice}
        discount={discount}
        finalPrice={finalPrice}
        onServiceToggle={handleServiceToggle}
        onServiceUpdate={handleServiceUpdate}
        onAddService={handleAddService}
        onRemoveService={handleRemoveService}
        onTotalPriceChange={setTotalPrice}
        onDiscountChange={setDiscount}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Termos Financeiros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_terms">Condições de Pagamento *</Label>
            <Textarea
              id="payment_terms"
              value={formData.payment_terms}
              onChange={(e) => handleFormChange('payment_terms', e.target.value)}
              placeholder="Ex: 50% na assinatura e 50% 5 dias antes do evento"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validity_date">Data de Validade *</Label>
            <Input
              id="validity_date"
              type="date"
              value={formData.validity_date}
              onChange={(e) => handleFormChange('validity_date', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações Gerais</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              placeholder="Observações adicionais sobre a proposta..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePreview}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Preview
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')} Proposta
        </Button>
      </div>

      <ProposalActionButtons
        proposal={proposal}
        template={selectedTemplate ? {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          colors: {
            primary: '#8A2BE2',
            secondary: '#F2AE30',
            accent: '#E57373',
            text: '#333333',
            background: '#FFFFFF'
          },
          fonts: {
            title: 'Playfair Display, serif',
            body: 'Inter, sans-serif'
          },
          logo: "https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png",
          showQrCode: true,
          showTestimonials: true,
          showDifferentials: true,
          showAboutSection: true
        } : null}
        isFormValid={isFormValid}
        onSave={handleSaveProposal}
        isSaving={isSaving}
      />
    </form>
  );
};

export default ProposalGeneratorRefactored;
