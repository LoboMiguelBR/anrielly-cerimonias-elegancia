import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import * as Icons from "lucide-react";
import { getMenuSections, MenuItem } from "./config/menuConfig";

interface MobileAdminNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const MobileAdminNav = ({ activeTab = "dashboard", onTabChange }: MobileAdminNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuSections = getMenuSections();

  const handleTabSelect = (tabId: string) => {
    onTabChange?.(tabId);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu de Navegação</h2>
            
            <div className="space-y-6">
              {menuSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {section.items.map((item: MenuItem) => {
                      const IconComponent = Icons[item.icon] as React.ComponentType<{ className?: string }>;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabSelect(item.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-3" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  
                  {sectionIndex < menuSections.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileAdminNav;
