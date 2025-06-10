
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Database, Globe, RefreshCw, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  change: number;
  icon: React.ReactNode;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Mock data - em produção seria coletado de APIs reais
  useEffect(() => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'response_time',
        name: 'Tempo de Resposta',
        value: 245,
        unit: 'ms',
        status: 'good',
        change: -12,
        icon: <Zap className="w-5 h-5" />
      },
      {
        id: 'database_queries',
        name: 'Consultas DB/min',
        value: 1847,
        unit: 'queries',
        status: 'warning',
        change: 8,
        icon: <Database className="w-5 h-5" />
      },
      {
        id: 'active_users',
        name: 'Usuários Ativos',
        value: 23,
        unit: 'users',
        status: 'good',
        change: 15,
        icon: <Activity className="w-5 h-5" />
      },
      {
        id: 'page_load_time',
        name: 'Carregamento da Página',
        value: 1.8,
        unit: 's',
        status: 'good',
        change: -5,
        icon: <Globe className="w-5 h-5" />
      }
    ];
    setMetrics(mockMetrics);
  }, [timeRange]);

  // Mock chart data
  const chartData = [
    { time: '00:00', response_time: 250, users: 18, cpu: 45 },
    { time: '04:00', response_time: 230, users: 12, cpu: 38 },
    { time: '08:00', response_time: 280, users: 25, cpu: 55 },
    { time: '12:00', response_time: 320, users: 35, cpu: 72 },
    { time: '16:00', response_time: 290, users: 28, cpu: 68 },
    { time: '20:00', response_time: 245, users: 23, cpu: 52 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Bom';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return status;
    }
  };

  const refreshMetrics = () => {
    setLoading(true);
    // Simular reload de métricas
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Performance
          </h2>
          <p className="text-gray-600">Monitoramento de performance em tempo real</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {['1h', '24h', '7d', '30d'].map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range as any)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button 
            onClick={refreshMetrics}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-600">
                  {metric.icon}
                  <span className="text-sm">{metric.name}</span>
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {getStatusLabel(metric.status)}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {metric.value}{metric.unit}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                metric.change > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="response_time" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">API Gateway</div>
                <div className="text-sm text-gray-600">99.9% uptime</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">Banco de Dados</div>
                <div className="text-sm text-gray-600">Operacional</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <div className="font-medium">Cache Redis</div>
                <div className="text-sm text-gray-600">Alta utilização</div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
