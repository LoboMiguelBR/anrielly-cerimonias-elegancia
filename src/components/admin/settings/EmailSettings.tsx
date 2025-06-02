
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppSetting } from '@/hooks/useAppSettings';

interface EmailSettingsProps {
  settings: AppSetting[];
  onUpdate: (category: string, key: string, value: any) => Promise<any>;
}

const EmailSettings = ({ settings, onUpdate }: EmailSettingsProps) => {
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: true,
    from_name: '',
    from_email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      const newData = { ...formData };
      
      settings.forEach(setting => {
        if (setting.key in newData) {
          (newData as any)[setting.key] = setting.value;
        }
      });

      setFormData(newData);
    };

    loadSettings();
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all([
        onUpdate('email', 'smtp_host', formData.smtp_host),
        onUpdate('email', 'smtp_port', formData.smtp_port),
        onUpdate('email', 'smtp_user', formData.smtp_user),
        onUpdate('email', 'smtp_pass', formData.smtp_pass),
        onUpdate('email', 'smtp_secure', formData.smtp_secure),
        onUpdate('email', 'from_name', formData.from_name),
        onUpdate('email', 'from_email', formData.from_email)
      ]);
    } catch (error) {
      console.error('Error saving email settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testEmailConnection = async () => {
    // Implementar teste de conexão SMTP
    console.log('Testing email connection...', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configurações do Remetente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações do Remetente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_name">Nome do Remetente</Label>
                <Input
                  id="from_name"
                  value={formData.from_name}
                  onChange={(e) => handleInputChange('from_name', e.target.value)}
                  placeholder="Anrielly Gomes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from_email">Email do Remetente</Label>
                <Input
                  id="from_email"
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => handleInputChange('from_email', e.target.value)}
                  placeholder="noreply@anriellygomes.com"
                />
              </div>
            </div>
          </div>

          {/* Configurações SMTP */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações SMTP</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">Servidor SMTP</Label>
                <Input
                  id="smtp_host"
                  value={formData.smtp_host}
                  onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_port">Porta SMTP</Label>
                <Input
                  id="smtp_port"
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_user">Usuário SMTP</Label>
                <Input
                  id="smtp_user"
                  value={formData.smtp_user}
                  onChange={(e) => handleInputChange('smtp_user', e.target.value)}
                  placeholder="usuario@gmail.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_pass">Senha SMTP</Label>
                <Input
                  id="smtp_pass"
                  type="password"
                  value={formData.smtp_pass}
                  onChange={(e) => handleInputChange('smtp_pass', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smtp_secure"
                checked={formData.smtp_secure}
                onCheckedChange={(checked) => handleInputChange('smtp_secure', checked)}
              />
              <Label htmlFor="smtp_secure">Usar conexão segura (TLS/SSL)</Label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={testEmailConnection}
            >
              Testar Conexão
            </Button>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
