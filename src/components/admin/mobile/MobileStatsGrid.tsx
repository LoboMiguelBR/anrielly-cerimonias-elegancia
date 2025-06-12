
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveGrid from '@/components/ui/responsive-grid';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface MobileStatsGridProps {
  stats: StatItem[];
  loading?: boolean;
}

const MobileStatsGrid = ({ stats, loading = false }: MobileStatsGridProps) => {
  const { isMobile } = useMobileLayout();

  if (loading) {
    return (
      <ResponsiveGrid 
        cols={{ default: 1, sm: 2, lg: 4 }}
        gap={isMobile ? 'sm' : 'md'}
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid 
      cols={{ default: 1, sm: 2, lg: 4 }}
      gap={isMobile ? 'sm' : 'md'}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 truncate">
                  {stat.title}
                </h3>
                {IconComponent && (
                  <IconComponent 
                    className={`h-5 w-5 ${stat.color || 'text-gray-400'}`} 
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                
                {stat.subtitle && (
                  <p className="text-xs md:text-sm text-gray-500">
                    {stat.subtitle}
                  </p>
                )}
                
                {stat.trend && (
                  <div className={`text-xs flex items-center ${
                    stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>
                      {stat.trend.isPositive ? '↗' : '↘'} {Math.abs(stat.trend.value)}%
                    </span>
                    <span className="ml-1 text-gray-500">
                      vs mês anterior
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </ResponsiveGrid>
  );
};

export default MobileStatsGrid;
