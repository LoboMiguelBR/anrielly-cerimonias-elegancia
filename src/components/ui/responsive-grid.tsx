
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md'
}: ResponsiveGridProps) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const buildGridClasses = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(gridColsClasses[cols.default]);
    if (cols.sm) classes.push(`sm:${gridColsClasses[cols.sm]}`);
    if (cols.md) classes.push(`md:${gridColsClasses[cols.md]}`);
    if (cols.lg) classes.push(`lg:${gridColsClasses[cols.lg]}`);
    if (cols.xl) classes.push(`xl:${gridColsClasses[cols.xl]}`);
    
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        buildGridClasses(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
