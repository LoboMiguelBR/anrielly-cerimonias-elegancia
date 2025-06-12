
import React from 'react';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import ResponsiveContainer from '@/components/ui/responsive-container';
import ResponsiveGrid from '@/components/ui/responsive-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

const MobileOptimizedLayout = ({ 
  children, 
  title,
  actions 
}: MobileOptimizedLayoutProps) => {
  const { isMobile, isTablet } = useMobileLayout();

  return (
    <ResponsiveContainer size="full" center>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        {title && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
            
            {actions && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`
          ${isMobile ? 'space-y-4' : 'space-y-6'}
          ${isTablet ? 'px-2' : ''}
        `}>
          {children}
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default MobileOptimizedLayout;
