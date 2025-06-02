
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';
import { AppSetting } from '@/hooks/useAppSettings';

interface SystemSettingsProps {
  settings: AppSetting[];
  onUpdate: (category: string, key: string, value: any) => Promise<any>;
}

const SystemSettings = ({ settings, onUpdate }: SystemSettingsProps) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // Implementar backup do sistema
      console.log('Creating system backup...');
      // Simular processo de backup
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Backup failed:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      // Implementar restauração do sistema
      console.log('Restoring system...');
      // Simular processo de restauração
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const systemInfo = {
    version: '1.0.0',
    lastBackup: '2024-01-15 14:30:00',
    databaseSize: '45.2 MB',
    totalUsers: 5,
    totalClients: 123,
    totalProposals: 67,
    totalContracts: 45
  };

  return (
    <div className="space-y-6">
      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Versão:</span>
                <Badge variant="outline">{systemInfo.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tamanho do Banco:</span>
                <span className="font-medium">{systemInfo.databaseSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Último Backup:</span>
                <span className="font-medium">{systemInfo.lastBackup}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Usuários:</span>
                <span className="font-medium">{systemInfo.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Clientes:</span>
                <span className="font-medium">{systemInfo.totalClients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Propostas:</span>
                <span className="font-medium">{systemInfo.totalProposals}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Restauração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Restauração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Recomendamos fazer backup regularmente dos seus dados importantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="flex items-center gap-2"
              >
                {isBackingUp ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isBackingUp ? 'Fazendo Backup...' : 'Fazer Backup'}
              </Button>

              <Button 
                variant="outline"
                onClick={handleRestore}
                disabled={isRestoring}
                className="flex items-center gap-2"
              >
                {isRestoring ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isRestoring ? 'Restaurando...' : 'Restaurar Backup'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manutenção */}
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de Manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Otimizar Banco de Dados
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
