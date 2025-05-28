
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck } from 'lucide-react';
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
  const [availableClients, setAvailableClients] = useState<Array<{ 
    id: string; 
    name: string; 
    email: string; 
    phone: string; 
    event_type?: string; 
    event_date?: string; 
    event_location?: string; 
    category?: string;
    city?: string;
  }>>([]);

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
        event_location: p.city,
        category: p.category,
        city: p.city
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

  const getClientTypeStats = () => {
    return {
      leads: quoteRequests.length,
      professionals: professionals.length
    };
  };

  const stats = getClientTypeStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.leads}</div>
            <div className="text-sm text-blue-700">Leads Disponíveis</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.professionals}</div>
            <div className="text-sm text-purple-700">Profissionais Cadastrados</div>
          </div>
        </div>

        {/* Seleção do Tipo de Cliente */}
        <div className="space-y-2">
          <Label>Tipo de Cliente *</Label>
          <Select 
            value={selectedClientType} 
            onValueChange={onClientTypeChange}
            disabled={isLoading || disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Lead (Cliente Final)
                  <Badge variant="secondary">{stats.leads}</Badge>
                </div>
              </SelectItem>
              <SelectItem value="professional">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profissional (Parceiro)
                  <Badge variant="secondary">{stats.professionals}</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {selectedClientType === 'lead' && 'Leads são clientes que solicitaram orçamentos através do site.'}
            {selectedClientType === 'professional' && 'Profissionais são parceiros cadastrados no sistema.'}
          </p>
        </div>

        {/* Seleção do Cliente/Profissional */}
        {selectedClientType && (
          <div className="space-y-2">
            <Label>
              {selectedClientType === 'lead' ? 'Selecionar Lead' : 'Selecionar Profissional'} *
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
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-sm text-gray-500">{client.email}</span>
                      {selectedClientType === 'professional' && client.category && (
                        <span className="text-xs text-purple-600">{client.category} - {client.city}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
                {availableClients.length === 0 && (
                  <SelectItem value="empty" disabled>
                    {selectedClientType === 'lead' 
                      ? 'Nenhum lead encontrado' 
                      : 'Nenhum profissional encontrado'
                    }
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cliente Selecionado */}
        {selectedClientId && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {selectedClientType === 'lead' ? 'Lead Selecionado' : 'Profissional Selecionado'}
              </span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Nome:</strong> {formData.client_name}</p>
              <p><strong>Email:</strong> {formData.client_email}</p>
              <p><strong>Telefone:</strong> {formData.client_phone}</p>
            </div>
          </div>
        )}

        {/* Campos Editáveis */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Dados do Cliente</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => onFormDataChange('client_name', e.target.value)}
                disabled={isLoading}
                required
                placeholder="Nome completo do cliente"
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
                placeholder="email@exemplo.com"
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
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfessionalSelector;
