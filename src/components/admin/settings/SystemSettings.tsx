
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from '@/hooks/useAppSettings';

const SystemSettings = () => {
  const { getSetting, updateSetting } = useAppSettings();
  const [formData, setFormData] = useState({
    timezone: '',
    language: '',
    date_format: '',
    currency: '',
    backup_enabled: true,
    maintenance_mode: false,
    debug_mode: false,
    session_timeout: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      timezone: getSetting('system', 'timezone') || 'America/Sao_Paulo',
      language: getSetting('system', 'language') || 'pt-BR',
      date_format: getSetting('system', 'date_format') || 'DD/MM/YYYY',
      currency: getSetting('system', 'currency') || 'BRL',
      backup_enabled: getSetting('system', 'backup_enabled') ?? true,
      maintenance_mode: getSetting('system', 'maintenance_mode') ?? false,
      debug_mode: getSetting('system', 'debug_mode') ?? false,
      session_timeout: getSetting('system', 'session_timeout') || '30'
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSetting('system', 'timezone', formData.timezone);
      await updateSetting('system', 'language', formData.language);
      await updateSetting('system', 'date_format', formData.date_format);
      await updateSetting('system', 'currency', formData.currency);
      await updateSetting('system', 'backup_enabled', formData.backup_enabled);
      await updateSetting('system', 'maintenance_mode', formData.maintenance_mode);
      await updateSetting('system', 'debug_mode', formData.debug_mode);
      await updateSetting('system', 'session_timeout', formData.session_timeout);
    } catch (error) {
      console.error('Error saving system settings:', error);
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
          <CardTitle>Configurações Regionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select 
                value={formData.timezone}
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">America/São Paulo</SelectItem>
                  <SelectItem value="America/New_York">America/New York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select 
                value={formData.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-format">Formato de Data</Label>
              <Select 
                value={formData.date_format}
                onValueChange={(value) => handleChange('date_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select 
                value={formData.currency}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
            <Input 
              id="session-timeout" 
              placeholder="30"
              value={formData.session_timeout}
              onChange={(e) => handleChange('session_timeout', e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="backup-enabled"
              checked={formData.backup_enabled}
              onCheckedChange={(checked) => handleChange('backup_enabled', checked)}
            />
            <Label htmlFor="backup-enabled">Backup automático habilitado</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance-mode"
              checked={formData.maintenance_mode}
              onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
            />
            <Label htmlFor="maintenance-mode">Modo de manutenção</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="debug-mode"
              checked={formData.debug_mode}
              onCheckedChange={(checked) => handleChange('debug_mode', checked)}
            />
            <Label htmlFor="debug-mode">Modo debug</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações do Sistema'}
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
