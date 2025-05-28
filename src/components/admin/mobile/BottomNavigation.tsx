
import React from 'react';
import { Button } from "@/components/ui/button";
import { getAllMenuItems, MenuItem } from '../config/menuConfig';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { isMobile } = useMobileLayout();
  
  if (!isMobile) return null;

  const allMenuItems = getAllMenuItems();
  const mainItems = allMenuItems.slice(0, 5); // Show only first 5 items

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {mainItems.map((item: MenuItem) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-h-[56px] px-2 py-1 ${
                isActive 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-[60px]">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
