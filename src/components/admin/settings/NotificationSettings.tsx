
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { getSettingsByCategory, updateSetting } = useAppSettings();
  const notificationSettings = getSettingsByCategory('notifications');
  
  const [formData, setFormData] = useState({
    email_new_lead: false,
    email_new_quote: false,
    email_contract_signed: false,
    daily_summary: false
  });

  useEffect(() => {
    const settingsMap = notificationSettings.reduce((acc: Record<string, any>, setting) => {
      acc[setting.key] = setting.value === 'true' || setting.value === true;
      return acc;
    }, {});

    setFormData({
      email_new_lead: settingsMap.email_new_lead || false,
      email_new_quote: settingsMap.email_new_quote || false,
      email_contract_signed: settingsMap.email_contract_signed || false,
      daily_summary: settingsMap.daily_summary || false
    });
  }, [notificationSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await Promise.all([
        updateSetting('notifications', 'email_new_lead', formData.email_new_lead),
        updateSetting('notifications', 'email_new_quote', formData.email_new_quote),
        updateSetting('notifications', 'email_contract_signed', formData.email_contract_signed),
        updateSetting('notifications', 'daily_summary', formData.daily_summary)
      ]);
      
      toast.success('Configurações de notificação atualizadas com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar configurações de notificação');
      console.error('Error updating notification settings:', error);
    }
  };

  const notifications = [
    {
      key: 'email_new_lead',
      label: 'Novo Lead',
      description: 'Receber email quando um novo lead for cadastrado'
    },
    {
      key: 'email_new_quote',
      label: 'Nova Solicitação de Orçamento',
      description: 'Receber email quando uma nova solicitação de orçamento for recebida'
    },
    {
      key: 'email_contract_signed',
      label: 'Contrato Assinado',
      description: 'Receber email quando um contrato for assinado'
    },
    {
      key: 'daily_summary',
      label: 'Resumo Diário',
      description: 'Receber resumo diário das atividades por email'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.key} className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.key}>{notification.label}</Label>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                </div>
                <Switch
                  id={notification.key}
                  checked={formData[notification.key as keyof typeof formData]}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, [notification.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
