
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

const SystemSettings = () => {
  const { getSettingsByCategory, updateSetting } = useAppSettings();
  const systemSettings = getSettingsByCategory('system');
  
  const [formData, setFormData] = useState({
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    date_format: 'dd/MM/yyyy'
  });

  useEffect(() => {
    const settingsMap = systemSettings.reduce((acc: Record<string, any>, setting) => {
      try {
        acc[setting.key] = setting.value ? JSON.parse(setting.value) : '';
      } catch {
        acc[setting.key] = setting.value || '';
      }
      return acc;
    }, {});

    setFormData({
      timezone: settingsMap.timezone || 'America/Sao_Paulo',
      currency: settingsMap.currency || 'BRL',
      date_format: settingsMap.date_format || 'dd/MM/yyyy'
    });
  }, [systemSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await Promise.all([
        updateSetting('system', 'timezone', JSON.stringify(formData.timezone)),
        updateSetting('system', 'currency', JSON.stringify(formData.currency)),
        updateSetting('system', 'date_format', JSON.stringify(formData.date_format))
      ]);
      
      toast.success('Configurações do sistema atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar configurações do sistema');
      console.error('Error updating system settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                <SelectItem value="America/Rio_Branco">Acre (GMT-5)</SelectItem>
                <SelectItem value="America/Manaus">Amazonas (GMT-4)</SelectItem>
                <SelectItem value="America/Recife">Recife (GMT-3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date_format">Formato de Data</Label>
            <Select
              value={formData.date_format}
              onValueChange={(value) => setFormData(prev => ({ ...prev, date_format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato de data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
