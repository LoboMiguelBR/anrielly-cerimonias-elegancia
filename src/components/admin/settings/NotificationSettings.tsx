
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppSetting } from '@/hooks/useAppSettings';

interface NotificationSettingsProps {
  settings: AppSetting[];
  onUpdate: (category: string, key: string, value: any) => Promise<any>;
}

const NotificationSettings = ({ settings, onUpdate }: NotificationSettingsProps) => {
  const [formData, setFormData] = useState({
    new_lead_alert: true,
    contract_signed_alert: true,
    event_reminder: true,
    proposal_viewed_alert: true,
    payment_received_alert: true,
    questionnaire_completed: true,
    daily_summary: false,
    weekly_report: false
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
      const promises = Object.entries(formData).map(([key, value]) =>
        onUpdate('notifications', key, value)
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const notificationGroups = [
    {
      title: "Alertas de Negócios",
      items: [
        { key: 'new_lead_alert', label: 'Novo lead recebido', description: 'Receba notificação quando um novo lead for cadastrado' },
        { key: 'contract_signed_alert', label: 'Contrato assinado', description: 'Receba notificação quando um contrato for assinado' },
        { key: 'proposal_viewed_alert', label: 'Proposta visualizada', description: 'Receba notificação quando uma proposta for visualizada pelo cliente' },
        { key: 'payment_received_alert', label: 'Pagamento recebido', description: 'Receba notificação sobre confirmação de pagamentos' }
      ]
    },
    {
      title: "Lembretes e Eventos",
      items: [
        { key: 'event_reminder', label: 'Lembrete de eventos', description: 'Receba lembretes sobre eventos próximos' },
        { key: 'questionnaire_completed', label: 'Questionário preenchido', description: 'Receba notificação quando um questionário for concluído' }
      ]
    },
    {
      title: "Relatórios Periódicos",
      items: [
        { key: 'daily_summary', label: 'Resumo diário', description: 'Receba um resumo das atividades do dia' },
        { key: 'weekly_report', label: 'Relatório semanal', description: 'Receba um relatório completo das atividades da semana' }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {notificationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="text-lg font-medium">{group.title}</h3>
              
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-start justify-between space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={item.key} className="text-sm font-medium">
                        {item.label}
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      id={item.key}
                      checked={(formData as any)[item.key]}
                      onCheckedChange={(checked) => handleSwitchChange(item.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
