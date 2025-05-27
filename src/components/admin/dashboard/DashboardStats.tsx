
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  quoteRequestsCount: number;
  proposalsCount: number;
  galleryCount: number;
  testimonialsCount: number;
  questionariosCount: number;
}

const DashboardStats = ({ 
  quoteRequestsCount, 
  proposalsCount, 
  galleryCount, 
  testimonialsCount, 
  questionariosCount 
}: DashboardStatsProps) => {
  // Calcular métricas derivadas
  const conversionRate = quoteRequestsCount > 0 ? ((proposalsCount / quoteRequestsCount) * 100) : 0;
  const totalRevenue = proposalsCount * 2500; // Estimativa
  
  const stats = [
    {
      title: "Orçamentos Pendentes",
      value: quoteRequestsCount,
      icon: FileText,
      trend: "+12%",
      trendUp: true,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      description: "Novos pedidos"
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: "+5.2%",
      trendUp: true,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      description: "Orçamentos → Propostas"
    },
    {
      title: "Receita Projetada",
      value: `R$ ${(totalRevenue / 1000).toFixed(0)}k`,
      icon: DollarSign,
      trend: "+18%",
      trendUp: true,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      description: "Este mês"
    },
    {
      title: "Eventos na Galeria",
      value: galleryCount,
      icon: Calendar,
      trend: "+8",
      trendUp: true,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      description: "Portfólio ativo"
    },
    {
      title: "Questionários",
      value: questionariosCount,
      icon: Users,
      trend: "+3",
      trendUp: true,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      description: "Em andamento"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className={`${stat.color} h-2`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                {stat.title}
                <Icon className="h-4 w-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
