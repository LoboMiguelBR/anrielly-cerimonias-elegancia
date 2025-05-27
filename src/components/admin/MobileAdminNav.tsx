
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  Calculator, 
  FileText, 
  FileTemplate,
  ScrollText,
  ClipboardList,
  Mail,
  ImageIcon,
  MessageSquare,
  HelpCircle
} from "lucide-react";

interface MobileAdminNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const MobileAdminNav = ({ activeTab = "dashboard", onTabChange }: MobileAdminNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuSections = [
    {
      title: "📊 DASHBOARD",
      items: [
        { id: "dashboard", label: "Dashboard Principal", icon: BarChart3 }
      ]
    },
    {
      title: "👥 LEADS & CLIENTES",
      items: [
        { id: "leads", label: "Leads", icon: Users },
        { id: "professionals", label: "Profissionais", icon: UserPlus }
      ]
    },
    {
      title: "💰 VENDAS",
      items: [
        { id: "quotes", label: "Orçamentos", icon: Calculator },
        { id: "proposals", label: "Propostas", icon: FileText },
        { id: "proposal-templates", label: "Templates de Propostas", icon: FileTemplate }
      ]
    },
    {
      title: "📝 CONTRATOS",
      items: [
        { id: "contracts", label: "Contratos", icon: ScrollText },
        { id: "contract-templates", label: "Templates de Contratos", icon: ClipboardList },
        { id: "contract-email-templates", label: "Templates de Email", icon: Mail }
      ]
    },
    {
      title: "🎨 CONTEÚDO",
      items: [
        { id: "gallery", label: "Galeria", icon: ImageIcon },
        { id: "testimonials", label: "Depoimentos", icon: MessageSquare },
        { id: "questionarios", label: "Questionários", icon: HelpCircle }
      ]
    }
  ];

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
                    {section.items.map((item) => {
                      const Icon = item.icon;
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
                          <Icon className="h-4 w-4 mr-3" />
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
