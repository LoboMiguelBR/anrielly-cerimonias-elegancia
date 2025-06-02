
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
    system_timezone: 'America/Sao_Paulo',
    date_format: 'dd/MM/yyyy',
    time_format: '24h',
    currency: 'BRL',
    language: 'pt-BR',
    maintenance_mode: false,
    debug_mode: false,
    auto_backup: true,
    backup_frequency: 'daily',
    session_timeout: '30',
    max_file_size: '10'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações existentes
    setFormData({
      system_timezone: getSetting('system', 'timezone') || 'America/Sao_Paulo',
      date_format: getSetting('system', 'date_format') || 'dd/MM/yyyy',
      time_format: getSetting('system', 'time_format') || '24h',
      currency: getSetting('system', 'currency') || 'BRL',
      language: getSetting('system', 'language') || 'pt-BR',
      maintenance_mode: getSetting('system', 'maintenance_mode') === true,
      debug_mode: getSetting('system', 'debug_mode') === true,
      auto_backup: getSetting('system', 'auto_backup') !== false,
      backup_frequency: getSetting('system', 'backup_frequency') || 'daily',
      session_timeout: getSetting('system', 'session_timeout') || '30',
      max_file_size: getSetting('system', 'max_file_size') || '10'
    });
  }, [getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        updateSetting('system', 'timezone', formData.system_timezone),
        updateSetting('system', 'date_format', formData.date_format),
        updateSetting('system', 'time_format', formData.time_format),
        updateSetting('system', 'currency', formData.currency),
        updateSetting('system', 'language', formData.language),
        updateSetting('system', 'maintenance_mode', formData.maintenance_mode),
        updateSetting('system', 'debug_mode', formData.debug_mode),
        updateSetting('system', 'auto_backup', formData.auto_backup),
        updateSetting('system', 'backup_frequency', formData.backup_frequency),
        updateSetting('system', 'session_timeout', formData.session_timeout),
        updateSetting('system', 'max_file_size', formData.max_file_size)
      ]);
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
          <div>
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select 
              value={formData.system_timezone}
              onValueChange={(value) => handleChange('system_timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                <SelectItem value="Atlantic/Fernando_de_Noronha">Fernando de Noronha (GMT-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date-format">Formato de Data</Label>
              <Select 
                value={formData.date_format}
                onValueChange={(value) => handleChange('date_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time-format">Formato de Hora</Label>
              <Select 
                value={formData.time_format}
                onValueChange={(value) => handleChange('time_format', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="debug-mode">Modo de debug</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session-timeout">Timeout da Sessão (minutos)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={formData.session_timeout}
                onChange={(e) => handleChange('session_timeout', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max-file-size">Tamanho Máximo de Arquivo (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={formData.max_file_size}
                onChange={(e) => handleChange('max_file_size', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup e Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-backup"
              checked={formData.auto_backup}
              onCheckedChange={(checked) => handleChange('auto_backup', checked)}
            />
            <Label htmlFor="auto-backup">Backup automático</Label>
          </div>

          <div>
            <Label htmlFor="backup-frequency">Frequência do backup</Label>
            <Select 
              value={formData.backup_frequency}
              onValueChange={(value) => handleChange('backup_frequency', value)}
              disabled={!formData.auto_backup}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
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

export default SystemSettings;
