
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { QuoteRequest } from '../../hooks/proposal/types';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
}

interface ClientProfessionalSelectorProps {
  quoteRequests: QuoteRequest[];
  professionals?: Professional[];
  selectedClientType: 'lead' | 'professional' | '';
  selectedClientId: string;
  formData: {
    client_name: string;
    client_email: string;
    client_phone: string;
    event_type: string;
    event_date?: string;
    event_location: string;
  };
  onClientTypeChange: (type: 'lead' | 'professional') => void;
  onClientSelect: (id: string) => void;
  onFormDataChange: (field: string, value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ClientProfessionalSelector: React.FC<ClientProfessionalSelectorProps> = ({
  quoteRequests,
  professionals = [],
  selectedClientType,
  selectedClientId,
  formData,
  onClientTypeChange,
  onClientSelect,
  onFormDataChange,
  isLoading = false,
  disabled = false
}) => {
  const [availableClients, setAvailableClients] = useState<Array<{ id: string; name: string; email: string; phone: string; event_type?: string; event_date?: string; event_location?: string; }>>([]);

  useEffect(() => {
    if (selectedClientType === 'lead') {
      setAvailableClients(quoteRequests.map(q => ({
        id: q.id,
        name: q.name,
        email: q.email || '',
        phone: q.phone || '',
        event_type: q.event_type || q.eventType,
        event_date: q.event_date,
        event_location: q.event_location
      })));
    } else if (selectedClientType === 'professional') {
      setAvailableClients(professionals.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        event_type: p.category,
        event_location: p.city
      })));
    }
  }, [selectedClientType, quoteRequests, professionals]);

  const handleClientSelect = (clientId: string) => {
    onClientSelect(clientId);
    
    const selectedClient = availableClients.find(c => c.id === clientId);
    if (selectedClient) {
      onFormDataChange('client_name', selectedClient.name);
      onFormDataChange('client_email', selectedClient.email);
      onFormDataChange('client_phone', selectedClient.phone);
      
      if (selectedClientType === 'lead') {
        onFormDataChange('event_type', selectedClient.event_type || '');
        onFormDataChange('event_date', selectedClient.event_date || '');
        onFormDataChange('event_location', selectedClient.event_location || '');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção do Tipo de Cliente */}
        <div className="space-y-2">
          <Label>Tipo de Cliente</Label>
          <Select 
            value={selectedClientType} 
            onValueChange={onClientTypeChange}
            disabled={isLoading || disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead (Cliente)</SelectItem>
              <SelectItem value="professional">Profissional (Parceiro)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seleção do Cliente/Profissional */}
        {selectedClientType && (
          <div className="space-y-2">
            <Label>
              {selectedClientType === 'lead' ? 'Selecionar Lead' : 'Selecionar Profissional'}
            </Label>
            <Select 
              value={selectedClientId} 
              onValueChange={handleClientSelect}
              disabled={isLoading || disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  selectedClientType === 'lead' 
                    ? "Selecione um lead" 
                    : "Selecione um profissional"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Campos Editáveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_name">Nome do Cliente *</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => onFormDataChange('client_name', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_email">Email *</Label>
            <Input
              id="client_email"
              type="email"
              value={formData.client_email}
              onChange={(e) => onFormDataChange('client_email', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_phone">Telefone *</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) => onFormDataChange('client_phone', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfessionalSelector;
