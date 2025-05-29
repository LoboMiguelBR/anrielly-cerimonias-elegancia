
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  FileText, 
  Users, 
  MessageSquare, 
  Calendar,
  Menu,
  Settings,
  Image,
  TrendingUp,
  UserPlus,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isMobile } = useMobileLayout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) return null;

  const primaryTabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'quotes', label: 'Orçamentos', icon: FileText },
    { id: 'gestao-comercial', label: 'Gestão', icon: TrendingUp },
    { id: 'menu', label: 'Menu', icon: Menu, special: true }
  ];

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quotes', label: 'Solicitações de Orçamento', icon: FileText },
    { id: 'proposals', label: 'Gerenciar Propostas', icon: FileText },
    { id: 'contracts', label: 'Contratos', icon: Calendar },
    { id: 'gestao-comercial', label: 'Gestão Comercial', icon: TrendingUp },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
    { id: 'leads', label: 'Leads', icon: UserPlus },
    { id: 'professionals', label: 'Profissionais', icon: Users },
    { id: 'questionarios', label: 'Questionários', icon: HelpCircle },
    { id: 'historias-casais', label: 'Histórias dos Casais', icon: BookOpen },
    { id: 'proposal-templates', label: 'Templates de Proposta', icon: Settings },
    { id: 'contract-templates', label: 'Templates de Contrato', icon: Settings },
    { id: 'contract-email-templates', label: 'Templates de Email', icon: Settings }
  ];

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const isTabActive = (tabId: string) => activeTab === tabId;

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {primaryTabs.map((tab) => {
            if (tab.special) {
              return (
                <Sheet key={tab.id} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-full rounded-none flex flex-col items-center justify-center gap-1 text-xs"
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Menu Completo</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-1 gap-2 mt-6">
                      {allTabs.map((menuTab) => (
                        <Button
                          key={menuTab.id}
                          variant={isTabActive(menuTab.id) ? "default" : "ghost"}
                          className="justify-start h-12 text-left"
                          onClick={() => handleTabSelect(menuTab.id)}
                        >
                          <menuTab.icon className="h-5 w-5 mr-3" />
                          {menuTab.label}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              );
            }

            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={`h-full rounded-none flex flex-col items-center justify-center gap-1 text-xs ${
                  isTabActive(tab.id) ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
                }`}
                onClick={() => handleTabSelect(tab.id)}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
