
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Users, Image, MessageCircle, FileText, Camera, Palette, Heart } from 'lucide-react';

interface MobileAdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileAdminNav = ({ activeTab, onTabChange }: MobileAdminNavProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'professionals', label: 'Profissionais', icon: Users },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'testimonials', label: 'Depoimentos', icon: MessageCircle },
    { id: 'quotes', label: 'Orçamentos', icon: FileText },
    { id: 'proposals', label: 'Propostas', icon: Camera },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'questionarios', label: 'Questionários', icon: Heart },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu Administrativo</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileAdminNav;
