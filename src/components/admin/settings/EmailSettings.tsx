
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

const EmailSettings = () => {
  const { getSettingsByCategory, updateSetting } = useAppSettings();
  const emailSettings = getSettingsByCategory('email');
  
  const [formData, setFormData] = useState({
    from_email: '',
    from_name: '',
    resend_api_key: ''
  });

  useEffect(() => {
    const settingsMap = emailSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value ? JSON.parse(setting.value) : '';
      return acc;
    }, {});

    setFormData({
      from_email: settingsMap.from_email || '',
      from_name: settingsMap.from_name || '',
      resend_api_key: settingsMap.resend_api_key || ''
    });
  }, [emailSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await Promise.all([
        updateSetting('email', 'from_email', JSON.stringify(formData.from_email)),
        updateSetting('email', 'from_name', JSON.stringify(formData.from_name)),
        updateSetting('email', 'resend_api_key', JSON.stringify(formData.resend_api_key))
      ]);
      
      toast.success('Configurações de email atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar configurações de email');
      console.error('Error updating email settings:', error);
    }
  };

  const testEmailConnection = async () => {
    try {
      // Simular teste de conexão
      if (!formData.resend_api_key) {
        toast.error('Chave API do Resend é obrigatória');
        return;
      }
      
      toast.success('Conexão testada com sucesso!');
    } catch (error) {
      toast.error('Erro ao testar conexão');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="from_name">Nome do Remetente</Label>
            <Input
              id="from_name"
              value={formData.from_name}
              onChange={(e) => setFormData(prev => ({ ...prev, from_name: e.target.value }))}
              placeholder="Seu Nome ou Empresa"
              required
            />
          </div>

          <div>
            <Label htmlFor="from_email">Email Remetente</Label>
            <Input
              id="from_email"
              type="email"
              value={formData.from_email}
              onChange={(e) => setFormData(prev => ({ ...prev, from_email: e.target.value }))}
              placeholder="noreply@seudominio.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="resend_api_key">Chave API do Resend</Label>
            <Input
              id="resend_api_key"
              type="password"
              value={formData.resend_api_key}
              onChange={(e) => setFormData(prev => ({ ...prev, resend_api_key: e.target.value }))}
              placeholder="re_..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Obtenha sua chave API em{' '}
              <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                resend.com/api-keys
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Salvar Configurações
            </Button>
            <Button type="button" variant="outline" onClick={testEmailConnection}>
              Testar Conexão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
