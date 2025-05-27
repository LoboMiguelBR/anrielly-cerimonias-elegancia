
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'quote',
      message: 'Novo orçamento recebido de Maria Silva',
      time: '2 min atrás',
      status: 'new',
      icon: FileText
    },
    {
      id: 2,
      type: 'contract',
      message: 'Contrato assinado - Casamento João & Ana',
      time: '1 hora atrás',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'proposal',
      message: 'Proposta enviada para Carlos Mendes',
      time: '3 horas atrás',
      status: 'sent',
      icon: User
    },
    {
      id: 4,
      type: 'reminder',
      message: 'Questionário pendente - Wedding Dreams',
      time: '1 dia atrás',
      status: 'pending',
      icon: AlertCircle
    },
    {
      id: 5,
      type: 'gallery',
      message: '12 novas fotos adicionadas à galeria',
      time: '2 dias atrás',
      status: 'info',
      icon: FileText
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
