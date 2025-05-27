
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractFormData, ContractData, CIVIL_STATUS_OPTIONS } from '../hooks/contract/types';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';

interface ContractFormProps {
  initialData?: ContractData;
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  quoteIdFromUrl?: string | null;
}

const ContractForm = ({ initialData, onSubmit, onCancel, isLoading, quoteIdFromUrl }: ContractFormProps) => {
  const { data: quoteRequests } = useQuoteRequests();
  
  const [formData, setFormData] = useState<ContractFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    client_profession: '',
    civil_status: '',
    event_type: '',
    event_date: '',
    event_time: '',
    event_location: '',
    total_price: '',
    down_payment: '',
    down_payment_date: '',
    remaining_amount: '',
    remaining_payment_date: '',
    template_id: '',
    notes: '',
    quote_request_id: quoteIdFromUrl || '',
    proposal_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        client_name: initialData.client_name,
        client_email: initialData.client_email,
        client_phone: initialData.client_phone,
        client_address: initialData.client_address || '',
        client_profession: initialData.client_profession || '',
        civil_status: initialData.civil_status || '',
        event_type: initialData.event_type,
        event_date: initialData.event_date || '',
        event_time: initialData.event_time || '',
        event_location: initialData.event_location || '',
        total_price: initialData.total_price.toString(),
        down_payment: initialData.down_payment?.toString() || '',
        down_payment_date: initialData.down_payment_date || '',
        remaining_amount: initialData.remaining_amount?.toString() || '',
        remaining_payment_date: initialData.remaining_payment_date || '',
        template_id: initialData.template_id || '',
        notes: initialData.notes || '',
        quote_request_id: initialData.quote_request_id || '',
        proposal_id: initialData.proposal_id || ''
      });
    }
  }, [initialData]);

  // Auto-fill from selected quote request
  useEffect(() => {
    if (formData.quote_request_id && quoteRequests) {
      const selectedQuote = quoteRequests.find(q => q.id === formData.quote_request_id);
      if (selectedQuote) {
        setFormData(prev => ({
          ...prev,
          client_name: selectedQuote.name,
          client_email: selectedQuote.email,
          client_phone: selectedQuote.phone,
          event_type: selectedQuote.event_type,
          event_date: selectedQuote.event_date || '',
          event_location: selectedQuote.event_location
        }));
      }
    }
  }, [formData.quote_request_id, quoteRequests]);

  // Calculate remaining amount automatically
  useEffect(() => {
    const total = parseFloat(formData.total_price) || 0;
    const down = parseFloat(formData.down_payment) || 0;
    const remaining = total - down;
    
    if (remaining >= 0 && formData.down_payment) {
      setFormData(prev => ({
        ...prev,
        remaining_amount: remaining.toString()
      }));
    }
  }, [formData.total_price, formData.down_payment]);

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {initialData ? 'Editar Contrato' : 'Novo Contrato'}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Contrato'}
          </Button>
        </div>
      </div>

      {/* Quote Request Selection */}
      {!initialData && quoteRequests && quoteRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Solicitação de Orçamento (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.quote_request_id}
              onValueChange={(value) => handleInputChange('quote_request_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma solicitação para preencher automaticamente" />
              </SelectTrigger>
              <SelectContent>
                {quoteRequests.map((quote) => (
                  <SelectItem key={quote.id} value={quote.id}>
                    {quote.name} - {quote.event_type} ({quote.event_date ? new Date(quote.event_date).toLocaleDateString('pt-BR') : 'Sem data'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome Completo *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_email">Email *</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => handleInputChange('client_email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_phone">Telefone *</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => handleInputChange('client_phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="civil_status">Estado Civil</Label>
              <Select
                value={formData.civil_status}
                onValueChange={(value) => handleInputChange('civil_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  {CIVIL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_profession">Profissão</Label>
              <Input
                id="client_profession"
                value={formData.client_profession}
                onChange={(e) => handleInputChange('client_profession', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client_address">Endereço Completo</Label>
              <Input
                id="client_address"
                value={formData.client_address}
                onChange={(e) => handleInputChange('client_address', e.target.value)}
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
              <Label htmlFor="event_type">Tipo de Evento *</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => handleInputChange('event_type', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_date">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">Horário do Evento</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => handleInputChange('event_time', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="event_location">Local do Evento</Label>
              <Input
                id="event_location"
                value={formData.event_location}
                onChange={(e) => handleInputChange('event_location', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_price">Valor Total *</Label>
              <Input
                id="total_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_price}
                onChange={(e) => handleInputChange('total_price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down_payment">Valor da Entrada</Label>
              <Input
                id="down_payment"
                type="number"
                step="0.01"
                min="0"
                value={formData.down_payment}
                onChange={(e) => handleInputChange('down_payment', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="down_payment_date">Data da Entrada</Label>
              <Input
                id="down_payment_date"
                type="date"
                value={formData.down_payment_date}
                onChange={(e) => handleInputChange('down_payment_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remaining_amount">Valor do Saldo</Label>
              <Input
                id="remaining_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.remaining_amount}
                onChange={(e) => handleInputChange('remaining_amount', e.target.value)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remaining_payment_date">Data do Saldo</Label>
              <Input
                id="remaining_payment_date"
                type="date"
                value={formData.remaining_payment_date}
                onChange={(e) => handleInputChange('remaining_payment_date', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações Adicionais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ContractForm;
