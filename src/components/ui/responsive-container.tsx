
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
}

const ResponsiveContainer = ({ 
  children, 
  className, 
  size = 'xl',
  center = false 
}: ResponsiveContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
