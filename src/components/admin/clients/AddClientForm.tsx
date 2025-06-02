
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from '@/integrations/supabase/types';

type ClientInsert = Database['public']['Tables']['clientes']['Insert'];

interface AddClientFormProps {
  onSuccess: () => void;
  onSubmit: (data: ClientInsert) => Promise<any>;
}

const AddClientForm = ({ onSuccess, onSubmit }: AddClientFormProps) => {
  const [formData, setFormData] = useState<Partial<ClientInsert>>({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    client_type: 'pessoa_fisica',
    status: 'ativo'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.event_type) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as ClientInsert);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ClientInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="client_type">Tipo de Cliente</Label>
              <Select 
                value={formData.client_type || 'pessoa_fisica'} 
                onValueChange={(value) => handleInputChange('client_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                  <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="partner_name">Nome do Parceiro(a)</Label>
              <Input
                id="partner_name"
                value={formData.partner_name || ''}
                onChange={(e) => handleInputChange('partner_name', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_type">Tipo de Evento *</Label>
              <Select 
                value={formData.event_type || ''} 
                onValueChange={(value) => handleInputChange('event_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casamento">Casamento</SelectItem>
                  <SelectItem value="aniversario">Aniversário</SelectItem>
                  <SelectItem value="formatura">Formatura</SelectItem>
                  <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event_date">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date || ''}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="event_location">Local do Evento</Label>
              <Input
                id="event_location"
                value={formData.event_location || ''}
                onChange={(e) => handleInputChange('event_location', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="budget_range">Faixa Orçamentária</Label>
              <Select 
                value={formData.budget_range || ''} 
                onValueChange={(value) => handleInputChange('budget_range', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate_5k">Até R$ 5.000</SelectItem>
                  <SelectItem value="5k_15k">R$ 5.000 - R$ 15.000</SelectItem>
                  <SelectItem value="15k_30k">R$ 15.000 - R$ 30.000</SelectItem>
                  <SelectItem value="30k_50k">R$ 30.000 - R$ 50.000</SelectItem>
                  <SelectItem value="acima_50k">Acima de R$ 50.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label htmlFor="message">Observações</Label>
        <Textarea
          id="message"
          value={formData.message || ''}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default AddClientForm;
