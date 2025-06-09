
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useProposalForm } from '../hooks/proposal/useProposalForm';
import { ProposalData, Service, QuoteRequest } from '../hooks/proposal/types';
import { proposalTemplatesApi, ProposalTemplateData } from '../hooks/proposal/api/proposalTemplates';
import ProposalPDFGenerator from './pdf/ProposalPDFGenerator';
import { toast } from 'sonner';

interface ProposalGeneratorProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
  initialProposalId?: string;
  onClose?: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({
  quoteRequests,
  quoteIdFromUrl,
  initialProposalId,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateData | null>(null);
  const [templates, setTemplates] = useState<ProposalTemplateData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const {
    formData,
    setFormData,
    isSubmitting,
    isLoading,
    handleSubmit,
    addService,
    removeService,
    updateService
  } = useProposalForm(initialProposalId);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const fetchedTemplates = await proposalTemplatesApi.fetchProposalTemplates();
        setTemplates(fetchedTemplates);
        
        // Set default template
        const defaultTemplate = fetchedTemplates.find(t => t.is_default) || fetchedTemplates[0];
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
          setFormData(prev => ({ ...prev, template_id: defaultTemplate.id }));
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    
    loadTemplates();
  }, [setFormData]);

  // Load quote request data if provided
  useEffect(() => {
    const quoteId = quoteIdFromUrl || (formData.quote_request_id);
    if (quoteId) {
      const quote = quoteRequests.find(q => q.id === quoteId);
      if (quote && !formData.client_name) {
        setFormData(prev => ({
          ...prev,
          client_name: quote.name,
          client_email: quote.email,
          client_phone: quote.phone,
          event_type: quote.event_type,
          event_date: quote.event_date,
          event_location: quote.event_location,
          quote_request_id: quote.id
        }));
      }
    }
  }, [quoteIdFromUrl, quoteRequests, formData.quote_request_id, formData.client_name, setFormData]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setFormData(prev => ({ ...prev, template_id: templateId }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success && onClose) {
      onClose();
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

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
    const proposalData: ProposalData = {
      ...formData,
      total_price: parseFloat(formData.total_price) || 0
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview da Proposta</h3>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Voltar para Edição
          </Button>
        </div>
        
        <ProposalPDFGenerator
          proposal={proposalData}
          template={selectedTemplate || undefined}
          onPdfReady={(blob) => {
            toast.success('PDF gerado com sucesso!');
          }}
          onError={(error) => {
            toast.error('Erro ao gerar PDF: ' + error);
          }}
        />
      </div>
    );
  }

  const currentTotalPrice = parseFloat(formData.total_price) || 0;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Template da Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="template">Selecionar Template</Label>
            <Select value={selectedTemplate?.id || ''} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.is_default && '(Padrão)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_email">Email *</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_phone">Telefone *</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Information */}
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
                onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_date">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="event_location">Local do Evento *</Label>
              <Input
                id="event_location"
                value={formData.event_location}
                onChange={(e) => setFormData(prev => ({ ...prev, event_location: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Serviços
            <Button type="button" onClick={addService} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.services.map((service, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor={`service-name-${index}`}>Nome do Serviço *</Label>
                <Input
                  id={`service-name-${index}`}
                  value={service.name}
                  onChange={(e) => updateService(index, { name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-description-${index}`}>Descrição</Label>
                <Input
                  id={`service-description-${index}`}
                  value={service.description || ''}
                  onChange={(e) => updateService(index, { description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-price-${index}`}>Preço *</Label>
                <Input
                  id={`service-price-${index}`}
                  type="number"
                  step="0.01"
                  value={service.price}
                  onChange={(e) => updateService(index, { price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <div className="text-lg font-semibold">
              Total: R$ {currentTotalPrice.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
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
              onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validity_date">Data de Validade *</Label>
            <Input
              id="validity_date"
              type="date"
              value={formData.validity_date}
              onChange={(e) => setFormData(prev => ({ ...prev, validity_date: e.target.value }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
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
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais sobre a proposta..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (initialProposalId ? 'Atualizar' : 'Criar')} Proposta
        </Button>
      </div>
    </form>
  );
};

export default ProposalGenerator;
