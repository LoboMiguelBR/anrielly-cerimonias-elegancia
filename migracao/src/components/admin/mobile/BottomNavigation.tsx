
import React from 'react';
import { BarChart3, TrendingUp, Calendar, ClipboardList, Users } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const mobileItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3
    },
    {
      id: "gestao-comercial",
      label: "Vendas",
      icon: TrendingUp
    },
    {
      id: "calendario-eventos",
      label: "Agenda",
      icon: Calendar
    },
    {
      id: "questionarios",
      label: "Forms",
      icon: ClipboardList
    },
    {
      id: "leads",
      label: "Leads",
      icon: Users
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {mobileItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
