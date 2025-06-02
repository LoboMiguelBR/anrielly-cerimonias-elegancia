
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from '@/hooks/useClients';

interface AddClientFormProps {
  onSuccess: () => void;
  onSubmit: (client: Partial<Client>) => Promise<any>;
}

const AddClientForm = ({ onSuccess, onSubmit }: AddClientFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    client_type: 'pessoa_fisica' as 'pessoa_fisica' | 'pessoa_juridica',
    document_type: 'cpf' as 'cpf' | 'cnpj',
    document_number: '',
    partner_name: '',
    event_type: '',
    event_date: '',
    event_location: '',
    budget_range: '',
    referral_source: '',
    message: '',
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Preparar dados para envio
      const clientData = {
        ...formData,
        address: {},
        social_media: {},
        preferences: {}
      };

      await onSubmit(clientData);
      onSuccess();
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="partner_name">Nome do Parceiro(a)</Label>
            <Input
              id="partner_name"
              value={formData.partner_name}
              onChange={(e) => handleInputChange('partner_name', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_type">Tipo de Cliente</Label>
            <Select value={formData.client_type} onValueChange={(value: 'pessoa_fisica' | 'pessoa_juridica') => handleInputChange('client_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_type">Tipo Documento</Label>
            <Select value={formData.document_type} onValueChange={(value: 'cpf' | 'cnpj') => handleInputChange('document_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_number">Número do Documento</Label>
            <Input
              id="document_number"
              value={formData.document_number}
              onChange={(e) => handleInputChange('document_number', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Informações do Evento */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações do Evento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_type">Tipo do Evento</Label>
            <Input
              id="event_type"
              value={formData.event_type}
              onChange={(e) => handleInputChange('event_type', e.target.value)}
              placeholder="Ex: Casamento, Aniversário..."
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_location">Local do Evento</Label>
          <Input
            id="event_location"
            value={formData.event_location}
            onChange={(e) => handleInputChange('event_location', e.target.value)}
            placeholder="Endereço completo do evento"
          />
        </div>
      </div>

      {/* Informações Comerciais */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Comerciais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget_range">Faixa Orçamentária</Label>
            <Select value={formData.budget_range} onValueChange={(value) => handleInputChange('budget_range', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="até-5k">Até R$ 5.000</SelectItem>
                <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                <SelectItem value="10k-20k">R$ 10.000 - R$ 20.000</SelectItem>
                <SelectItem value="20k-50k">R$ 20.000 - R$ 50.000</SelectItem>
                <SelectItem value="acima-50k">Acima de R$ 50.000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referral_source">Fonte de Indicação</Label>
            <Select value={formData.referral_source} onValueChange={(value) => handleInputChange('referral_source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Como nos conheceu?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="wedding-sites">Sites de Casamento</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="message">Observações</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Observações adicionais sobre o cliente..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Cadastrar Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default AddClientForm;
