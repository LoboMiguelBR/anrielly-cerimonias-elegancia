
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppSettings } from '@/hooks/useAppSettings';

const NotificationSettings = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    email_new_lead: true,
    email_new_quote: true,
    email_contract_signed: true,
    email_payment_received: true,
    sms_enabled: false,
    push_enabled: true,
    daily_summary: true,
    weekly_report: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      email_new_lead: getSetting('notifications', 'email_new_lead') ?? true,
      email_new_quote: getSetting('notifications', 'email_new_quote') ?? true,
      email_contract_signed: getSetting('notifications', 'email_contract_signed') ?? true,
      email_payment_received: getSetting('notifications', 'email_payment_received') ?? true,
      sms_enabled: getSetting('notifications', 'sms_enabled') ?? false,
      push_enabled: getSetting('notifications', 'push_enabled') ?? true,
      daily_summary: getSetting('notifications', 'daily_summary') ?? true,
      weekly_report: getSetting('notifications', 'weekly_report') ?? false
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSetting('notifications', 'email_new_lead', formData.email_new_lead);
      await updateSetting('notifications', 'email_new_quote', formData.email_new_quote);
      await updateSetting('notifications', 'email_contract_signed', formData.email_contract_signed);
      await updateSetting('notifications', 'email_payment_received', formData.email_payment_received);
      await updateSetting('notifications', 'sms_enabled', formData.sms_enabled);
      await updateSetting('notifications', 'push_enabled', formData.push_enabled);
      await updateSetting('notifications', 'daily_summary', formData.daily_summary);
      await updateSetting('notifications', 'weekly_report', formData.weekly_report);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações por Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-new-lead"
              checked={formData.email_new_lead}
              onCheckedChange={(checked) => handleChange('email_new_lead', checked)}
            />
            <Label htmlFor="email-new-lead">Novo lead recebido</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="email-new-quote"
              checked={formData.email_new_quote}
              onCheckedChange={(checked) => handleChange('email_new_quote', checked)}
            />
            <Label htmlFor="email-new-quote">Nova solicitação de orçamento</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="email-contract-signed"
              checked={formData.email_contract_signed}
              onCheckedChange={(checked) => handleChange('email_contract_signed', checked)}
            />
            <Label htmlFor="email-contract-signed">Contrato assinado</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="email-payment-received"
              checked={formData.email_payment_received}
              onCheckedChange={(checked) => handleChange('email_payment_received', checked)}
            />
            <Label htmlFor="email-payment-received">Pagamento recebido</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outros Canais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="sms-enabled"
              checked={formData.sms_enabled}
              onCheckedChange={(checked) => handleChange('sms_enabled', checked)}
            />
            <Label htmlFor="sms-enabled">Notificações por SMS</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="push-enabled"
              checked={formData.push_enabled}
              onCheckedChange={(checked) => handleChange('push_enabled', checked)}
            />
            <Label htmlFor="push-enabled">Notificações push</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="daily-summary"
              checked={formData.daily_summary}
              onCheckedChange={(checked) => handleChange('daily_summary', checked)}
            />
            <Label htmlFor="daily-summary">Resumo diário</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="weekly-report"
              checked={formData.weekly_report}
              onCheckedChange={(checked) => handleChange('weekly_report', checked)}
            />
            <Label htmlFor="weekly-report">Relatório semanal</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações de Notificação'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
