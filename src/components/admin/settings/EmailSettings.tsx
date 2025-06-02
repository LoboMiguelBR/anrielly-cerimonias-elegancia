
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from '@/hooks/useAppSettings';

const EmailSettings = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_email: '',
    from_name: '',
    reply_to: '',
    email_notifications: true,
    email_signature: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações existentes
    setFormData({
      smtp_host: getSetting('email', 'smtp_host') || '',
      smtp_port: getSetting('email', 'smtp_port') || '587',
      smtp_username: getSetting('email', 'smtp_username') || '',
      smtp_password: getSetting('email', 'smtp_password') || '',
      smtp_encryption: getSetting('email', 'smtp_encryption') || 'tls',
      from_email: getSetting('email', 'from_email') || '',
      from_name: getSetting('email', 'from_name') || '',
      reply_to: getSetting('email', 'reply_to') || '',
      email_notifications: getSetting('email', 'email_notifications') !== false,
      email_signature: getSetting('email', 'email_signature') || ''
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        updateSetting('email', 'smtp_host', formData.smtp_host),
        updateSetting('email', 'smtp_port', formData.smtp_port),
        updateSetting('email', 'smtp_username', formData.smtp_username),
        updateSetting('email', 'smtp_password', formData.smtp_password),
        updateSetting('email', 'smtp_encryption', formData.smtp_encryption),
        updateSetting('email', 'from_email', formData.from_email),
        updateSetting('email', 'from_name', formData.from_name),
        updateSetting('email', 'reply_to', formData.reply_to),
        updateSetting('email', 'email_notifications', formData.email_notifications),
        updateSetting('email', 'email_signature', formData.email_signature)
      ]);
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
          <CardTitle>Configurações SMTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.gmail.com"
                value={formData.smtp_host}
                onChange={(e) => handleChange('smtp_host', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">Porta</Label>
              <Input
                id="smtp-port"
                placeholder="587"
                value={formData.smtp_port}
                onChange={(e) => handleChange('smtp_port', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-username">Usuário</Label>
              <Input
                id="smtp-username"
                placeholder="seu@email.com"
                value={formData.smtp_username}
                onChange={(e) => handleChange('smtp_username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">Senha</Label>
              <Input
                id="smtp-password"
                type="password"
                placeholder="••••••••"
                value={formData.smtp_password}
                onChange={(e) => handleChange('smtp_password', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="smtp-encryption">Criptografia</Label>
            <Select 
              value={formData.smtp_encryption}
              onValueChange={(value) => handleChange('smtp_encryption', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="none">Nenhuma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Envio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-email">Email de Envio</Label>
              <Input
                id="from-email"
                placeholder="contato@anriellygomes.com"
                value={formData.from_email}
                onChange={(e) => handleChange('from_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="from-name">Nome do Remetente</Label>
              <Input
                id="from-name"
                placeholder="Anrielly Gomes"
                value={formData.from_name}
                onChange={(e) => handleChange('from_name', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reply-to">Email de Resposta</Label>
            <Input
              id="reply-to"
              placeholder="contato@anriellygomes.com"
              value={formData.reply_to}
              onChange={(e) => handleChange('reply_to', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={formData.email_notifications}
              onCheckedChange={(checked) => handleChange('email_notifications', checked)}
            />
            <Label htmlFor="email-notifications">Ativar notificações por email</Label>
          </div>

          <div>
            <Label htmlFor="email-signature">Assinatura de Email</Label>
            <Textarea
              id="email-signature"
              placeholder="Atenciosamente,&#10;Anrielly Gomes&#10;Cerimonialista"
              rows={4}
              value={formData.email_signature}
              onChange={(e) => handleChange('email_signature', e.target.value)}
            />
          </div>
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

export default EmailSettings;
