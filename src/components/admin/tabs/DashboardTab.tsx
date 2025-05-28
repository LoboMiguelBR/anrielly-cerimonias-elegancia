
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Plus } from 'lucide-react';
import { useTestimonials } from '../hooks/testimonials/useTestimonials';
import { useContracts } from '../hooks/contract/useContracts';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigate }) => {
  const { testimonials } = useTestimonials();
  const { contracts } = useContracts();

  // Safely handle testimonials array
  const testimonialsCount = Array.isArray(testimonials) ? testimonials.length : 0;
  const contractsCount = Array.isArray(contracts) ? contracts.length : 0;

  const stats = [
    {
      title: "Contratos Ativos",
      value: contractsCount,
      icon: FileText,
      action: () => onNavigate('contracts')
    },
    {
      title: "Depoimentos",
      value: testimonialsCount,
      icon: Users,
      action: () => onNavigate('testimonials')
    },
    {
      title: "Eventos Este Mês",
      value: "12",
      icon: Calendar,
      action: () => onNavigate('calendar')
    }
  ];

  const quickActions = [
    {
      title: "Novo Contrato",
      description: "Criar um novo contrato para cliente",
      action: () => onNavigate('contracts'),
      icon: FileText
    },
    {
      title: "Adicionar Depoimento",
      description: "Gerenciar depoimentos de clientes",
      action: () => onNavigate('testimonials'),
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={stat.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <action.icon className="h-5 w-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
              <Button onClick={action.action} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Criar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
