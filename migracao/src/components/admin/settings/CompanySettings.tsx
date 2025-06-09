
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

interface CompanySettingsProps {
  settings: any[];
  onUpdate: (category: string, key: string, value: any) => Promise<any>;
}

const CompanySettings = ({ settings, onUpdate }: CompanySettingsProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cnpj: '',
    logo_url: ''
  });

  useEffect(() => {
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value ? JSON.parse(setting.value) : '';
      return acc;
    }, {});

    setFormData({
      name: settingsMap.name || '',
      email: settingsMap.email || '',
      phone: settingsMap.phone || '',
      address: settingsMap.address || '',
      cnpj: settingsMap.cnpj || '',
      logo_url: settingsMap.logo_url || ''
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await Promise.all([
        onUpdate('company', 'name', JSON.stringify(formData.name)),
        onUpdate('company', 'email', JSON.stringify(formData.email)),
        onUpdate('company', 'phone', JSON.stringify(formData.phone)),
        onUpdate('company', 'address', JSON.stringify(formData.address)),
        onUpdate('company', 'cnpj', JSON.stringify(formData.cnpj)),
        onUpdate('company', 'logo_url', JSON.stringify(formData.logo_url))
      ]);
      
      toast.success('Configurações da empresa atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar configurações');
      console.error('Error updating company settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da empresa"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contato@empresa.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Endereço completo da empresa"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="logo_url">URL do Logo</Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
