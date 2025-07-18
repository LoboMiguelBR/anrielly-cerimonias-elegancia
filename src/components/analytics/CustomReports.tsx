import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomReport } from '@/hooks/analytics/useAnalytics';
import { ReportChart } from './ReportChart';
import { FileText, Download, Plus } from 'lucide-react';

export const CustomReports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('financial');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { data: reportData, isLoading, refetch } = useCustomReport(selectedReportType, filters);

  const reportTypes = [
    { value: 'financial', label: 'Relatório Financeiro' },
    { value: 'clients', label: 'Relatório de Clientes' },
    { value: 'proposals', label: 'Relatório de Propostas' },
    { value: 'events', label: 'Relatório de Eventos' },
    { value: 'performance', label: 'Relatório de Performance' },
  ];

  const handleGenerateReport = () => {
    refetch();
  };

  const handleExportReport = () => {
    if (reportData) {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${selectedReportType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Personalizados</h2>
          <p className="text-muted-foreground">
            Gere relatórios detalhados sobre diferentes aspectos do seu negócio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              <FileText className="h-4 w-4 mr-2" />
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            {reportData && (
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {reportTypes.find(t => t.value === selectedReportType)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart data={reportData} reportType={selectedReportType} />
          </CardContent>
        </Card>
      )}

      {/* Lista de relatórios salvos */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum relatório salvo ainda. Gere um relatório para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};