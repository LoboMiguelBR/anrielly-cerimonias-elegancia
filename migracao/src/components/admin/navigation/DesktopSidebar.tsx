
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { getMenuSections, MenuItem } from "../config/menuConfig";
import { Card, CardContent } from "@/components/ui/card";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DesktopSidebar = ({ activeTab, onTabChange }: DesktopSidebarProps) => {
  console.log('DesktopSidebar: Renderizando com activeTab:', activeTab);

  try {
    const menuSections = getMenuSections();
    
    if (!Array.isArray(menuSections) || menuSections.length === 0) {
      console.warn('DesktopSidebar: Nenhuma seção de menu encontrada');
      return (
        <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Menu não disponível</p>
              </CardContent>
            </Card>
          </div>
        </aside>
      );
    }

    console.log('DesktopSidebar: Seções do menu carregadas:', menuSections.length);

    return (
      <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu de Navegação</h2>
          
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => {
              if (!section || !section.title || !Array.isArray(section.items)) {
                console.warn('DesktopSidebar: Seção inválida encontrada:', section);
                return null;
              }

              return (
                <div key={section.title}>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {section.items.map((item: MenuItem) => {
                      if (!item || !item.id || !item.label) {
                        console.warn('DesktopSidebar: Item de menu inválido:', item);
                        return null;
                      }

                      try {
                        const IconComponent = item.icon || AlertTriangle;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              console.log('DesktopSidebar: Mudando para tab:', item.id);
                              onTabChange(item.id);
                            }}
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
                      } catch (error) {
                        console.error('DesktopSidebar: Erro ao renderizar item:', item.id, error);
                        return (
                          <div key={item.id} className="w-full flex items-center px-3 py-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-3" />
                            Erro: {item.label}
                          </div>
                        );
                      }
                    })}
                  </div>
                  
                  {sectionIndex < menuSections.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    );
  } catch (error) {
    console.error('DesktopSidebar: Erro crítico na renderização:', error);
    
    return (
      <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Erro na sidebar</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Recarregar
              </button>
            </CardContent>
          </Card>
        </div>
      </aside>
    );
  }
};

export default DesktopSidebar;
