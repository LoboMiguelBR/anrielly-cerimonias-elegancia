
import { Separator } from "@/components/ui/separator";
import { menuSections, MenuItem } from "../config/menuConfig";
import { useAuth } from '@/hooks/useAuth';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DesktopSidebar = ({ activeTab, onTabChange }: DesktopSidebarProps) => {
  const { profile } = useAuth();

  // Função para verificar se o usuário tem acesso ao item
  const hasAccess = (itemId: string) => {
    const restrictedItems = ['leads', 'clientes', 'professionals'];
    if (restrictedItems.includes(itemId)) {
      return profile?.role === 'admin';
    }
    return true;
  };

  return (
    <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu de Navegação</h2>
        
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item: MenuItem) => {
                  const IconComponent = item.icon;
                  const accessAllowed = hasAccess(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => accessAllowed && onTabChange(item.id)}
                      disabled={!accessAllowed}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : accessAllowed
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {!accessAllowed && (
                        <span className="text-xs text-gray-400 ml-2">Admin</span>
                      )}
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
    </aside>
  );
};

export default DesktopSidebar;
