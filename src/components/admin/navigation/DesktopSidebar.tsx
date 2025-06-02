
import { Separator } from "@/components/ui/separator";
import { menuSections, MenuItem } from "../config/menuConfig";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DesktopSidebar = ({ activeTab, onTabChange }: DesktopSidebarProps) => {
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
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
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
    </aside>
  );
};

export default DesktopSidebar;
