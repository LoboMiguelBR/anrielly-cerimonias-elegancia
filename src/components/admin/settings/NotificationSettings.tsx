
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSettings } from '@/hooks/useAppSettings';

const NotificationSettings = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    email_new_lead: true,
    email_new_quote: true,
    email_contract_signed: true,
    email_event_reminder: true,
    email_payment_received: true,
    sms_enabled: false,
    push_enabled: true,
    notification_frequency: 'immediate',
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações existentes
    setFormData({
      email_new_lead: getSetting('notifications', 'email_new_lead') !== false,
      email_new_quote: getSetting('notifications', 'email_new_quote') !== false,
      email_contract_signed: getSetting('notifications', 'email_contract_signed') !== false,
      email_event_reminder: getSetting('notifications', 'email_event_reminder') !== false,
      email_payment_received: getSetting('notifications', 'email_payment_received') !== false,
      sms_enabled: getSetting('notifications', 'sms_enabled') === true,
      push_enabled: getSetting('notifications', 'push_enabled') !== false,
      notification_frequency: getSetting('notifications', 'notification_frequency') || 'immediate',
      quiet_hours_start: getSetting('notifications', 'quiet_hours_start') || '22:00',
      quiet_hours_end: getSetting('notifications', 'quiet_hours_end') || '08:00'
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        updateSetting('notifications', 'email_new_lead', formData.email_new_lead),
        updateSetting('notifications', 'email_new_quote', formData.email_new_quote),
        updateSetting('notifications', 'email_contract_signed', formData.email_contract_signed),
        updateSetting('notifications', 'email_event_reminder', formData.email_event_reminder),
        updateSetting('notifications', 'email_payment_received', formData.email_payment_received),
        updateSetting('notifications', 'sms_enabled', formData.sms_enabled),
        updateSetting('notifications', 'push_enabled', formData.push_enabled),
        updateSetting('notifications', 'notification_frequency', formData.notification_frequency),
        updateSetting('notifications', 'quiet_hours_start', formData.quiet_hours_start),
        updateSetting('notifications', 'quiet_hours_end', formData.quiet_hours_end)
      ]);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
              id="email-event-reminder"
              checked={formData.email_event_reminder}
              onCheckedChange={(checked) => handleChange('email_event_reminder', checked)}
            />
            <Label htmlFor="email-event-reminder">Lembretes de evento</Label>
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
          <CardTitle>Outras Notificações</CardTitle>
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

          <div>
            <Label htmlFor="notification-frequency">Frequência das notificações</Label>
            <Select 
              value={formData.notification_frequency}
              onValueChange={(value) => handleChange('notification_frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Imediata</SelectItem>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diária</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horário Silencioso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-start">Início</Label>
              <input
                id="quiet-start"
                type="time"
                value={formData.quiet_hours_start}
                onChange={(e) => handleChange('quiet_hours_start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="quiet-end">Fim</Label>
              <input
                id="quiet-end"
                type="time"
                value={formData.quiet_hours_end}
                onChange={(e) => handleChange('quiet_hours_end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Durante este período, as notificações serão silenciadas (exceto emergências).
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
