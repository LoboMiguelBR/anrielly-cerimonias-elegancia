
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from '@/hooks/useAppSettings';

const EmailSettings = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_password: '',
    smtp_encryption: '',
    from_email: '',
    from_name: '',
    notifications_enabled: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      smtp_host: getSetting('email', 'smtp_host') || '',
      smtp_port: getSetting('email', 'smtp_port') || '',
      smtp_user: getSetting('email', 'smtp_user') || '',
      smtp_password: getSetting('email', 'smtp_password') || '',
      smtp_encryption: getSetting('email', 'smtp_encryption') || '',
      from_email: getSetting('email', 'from_email') || '',
      from_name: getSetting('email', 'from_name') || '',
      notifications_enabled: getSetting('email', 'notifications_enabled') ?? true
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSetting('email', 'smtp_host', formData.smtp_host);
      await updateSetting('email', 'smtp_port', formData.smtp_port);
      await updateSetting('email', 'smtp_user', formData.smtp_user);
      await updateSetting('email', 'smtp_password', formData.smtp_password);
      await updateSetting('email', 'smtp_encryption', formData.smtp_encryption);
      await updateSetting('email', 'from_email', formData.from_email);
      await updateSetting('email', 'from_name', formData.from_name);
      await updateSetting('email', 'notifications_enabled', formData.notifications_enabled);
    } catch (error) {
      console.error('Error saving email settings:', error);
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
          <CardTitle>Configurações de Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">Host SMTP</Label>
              <Input 
                id="smtp-host" 
                placeholder="smtp.gmail.com"
                value={formData.smtp_host}
                onChange={(e) => handleChange('smtp_host', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Porta</Label>
              <Input 
                id="smtp-port" 
                placeholder="587"
                value={formData.smtp_port}
                onChange={(e) => handleChange('smtp_port', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Usuário</Label>
              <Input 
                id="smtp-user" 
                placeholder="seu@email.com"
                value={formData.smtp_user}
                onChange={(e) => handleChange('smtp_user', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Senha</Label>
              <Input 
                id="smtp-password" 
                type="password"
                placeholder="********"
                value={formData.smtp_password}
                onChange={(e) => handleChange('smtp_password', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-email">Email Remetente</Label>
              <Input 
                id="from-email" 
                placeholder="noreply@exemplo.com"
                value={formData.from_email}
                onChange={(e) => handleChange('from_email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-name">Nome Remetente</Label>
              <Input 
                id="from-name" 
                placeholder="Anrielly Gomes"
                value={formData.from_name}
                onChange={(e) => handleChange('from_name', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notifications-enabled"
              checked={formData.notifications_enabled}
              onCheckedChange={(checked) => handleChange('notifications_enabled', checked)}
            />
            <Label htmlFor="notifications-enabled">Habilitar notificações por email</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações de Email'}
        </Button>
      </div>
    </div>
  );
};

export default EmailSettings;
