
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Users, Image, MessageCircle, FileText, Camera, Palette, Heart, FileSignature } from 'lucide-react';

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
    { id: 'contracts', label: 'Contratos', icon: FileSignature },
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
      <SheetContent side="left" className="w-80">
        <div className="py-6">
          <h2 className="text-lg font-semibold mb-4">Menu Administrativo</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileAdminNav;
