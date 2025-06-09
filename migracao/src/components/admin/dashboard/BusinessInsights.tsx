
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, AlertTriangle, Trophy } from 'lucide-react';

const BusinessInsights = () => {
  const insights = [
    {
      title: "Meta Mensal",
      current: 28700,
      target: 35000,
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Eventos Confirmados",
      current: 8,
      target: 12,
      icon: Calendar,
      color: "text-green-600"
    }
  ];

  const alerts = [
    {
      message: "3 contratos aguardando assinatura há mais de 7 dias",
      priority: "high",
      icon: AlertTriangle
    },
    {
      message: "5 questionários não finalizados este mês",
      priority: "medium",
      icon: AlertTriangle
    }
  ];

  const achievements = [
    { title: "Melhor mês do ano", badge: "🏆" },
    { title: "95% de satisfação", badge: "⭐" },
    { title: "12 eventos realizados", badge: "🎉" }
  ];

  return (
    <div className="space-y-6">
      {/* Metas e Progress */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Metas e Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const progress = (insight.current / insight.target) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${insight.color}`} />
                    <span className="font-medium text-gray-700">{insight.title}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {typeof insight.current === 'number' && insight.current > 1000 
                      ? `R$ ${insight.current.toLocaleString()}` 
                      : insight.current} / {typeof insight.target === 'number' && insight.target > 1000 
                      ? `R$ ${insight.target.toLocaleString()}` 
                      : insight.target}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500">{progress.toFixed(1)}% concluído</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Icon className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 text-xs ${alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {alert.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Conquistas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50">
                <span className="text-lg">{achievement.badge}</span>
                <span className="text-sm font-medium text-gray-700">{achievement.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInsights;
