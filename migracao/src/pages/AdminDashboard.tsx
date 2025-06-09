import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import DesktopSidebar from "@/components/admin/navigation/DesktopSidebar";
import BottomNavigation from "@/components/admin/mobile/BottomNavigation";
import TabContentRenderer from "@/components/admin/navigation/TabContentRenderer";
import { getAllMenuItems } from "@/components/admin/config/menuConfig";
import { useMobileLayout } from "@/hooks/useMobileLayout";
import SafeErrorBoundary from "@/components/admin/dashboard/SafeErrorBoundary";
import SidebarErrorBoundary from "@/components/admin/dashboard/SidebarErrorBoundary";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isInitialized, setIsInitialized] = useState(false);
  const { isMobile } = useMobileLayout();

  // Inicialização segura do componente
  useEffect(() => {
    try {
      console.log('AdminDashboard: Inicializando dashboard...');
      console.log('AdminDashboard: isMobile:', isMobile);
      
      // Verificação de segurança para garantir que activeTab sempre tenha um valor válido
      if (!activeTab || typeof activeTab !== 'string') {
        console.warn('AdminDashboard: Invalid activeTab, resetting to dashboard');
        setActiveTab("dashboard");
      }
      
      // Marcar como inicializado após verificações
      setIsInitialized(true);
      console.log('AdminDashboard: Dashboard inicializado com sucesso');
    } catch (error) {
      console.error('AdminDashboard: Erro na inicialização:', error);
      setActiveTab("dashboard");
      setIsInitialized(true);
    }
  }, [activeTab, isMobile]);

  const allMenuItems = getAllMenuItems();

  // Verificação de segurança para getAllMenuItems
  const validMenuItems = Array.isArray(allMenuItems) ? allMenuItems.filter(item => 
    item && item.id && typeof item.id === 'string' && item.label
  ) : [];

  if (validMenuItems.length === 0) {
    console.warn('AdminDashboard: No valid menu items found');
  }

  const handleTabChange = (newTab: string) => {
    if (!newTab || typeof newTab !== 'string') {
      console.warn('AdminDashboard: Invalid tab change attempt', newTab);
      return;
    }

    try {
      console.log('AdminDashboard: Changing tab to:', newTab);
      setActiveTab(newTab);
    } catch (error) {
      console.error('AdminDashboard: Error changing tab', error);
      setActiveTab("dashboard"); // Fallback seguro
    }
  };

  // Loading state durante inicialização
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SafeErrorBoundary componentName="AdminDashboard">
      <div className="min-h-screen bg-gray-50">
        <SafeErrorBoundary componentName="AdminHeader">
          <AdminHeader />
        </SafeErrorBoundary>
        
        <div className="flex">
          {/* Desktop Sidebar com Error Boundary específico */}
          {!isMobile && (
            <SidebarErrorBoundary>
              <DesktopSidebar activeTab={activeTab} onTabChange={handleTabChange} />
            </SidebarErrorBoundary>
          )}

          {/* Mobile Navigation (legacy - hidden in favor of bottom nav) */}
          <div className="hidden">
            <SafeErrorBoundary componentName="MobileAdminNav">
              <MobileAdminNav activeTab={activeTab} onTabChange={handleTabChange} />
            </SafeErrorBoundary>
          </div>

          {/* Main Content */}
          <main className={`flex-1 ${isMobile ? 'pb-20' : 'lg:pl-0'} min-h-screen`}>
            <div className={`${isMobile ? 'p-2' : 'p-4 md:p-6'}`}>
              <SafeErrorBoundary componentName="TabsContainer">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  {/* Hidden TabsList for accessibility */}
                  <TabsList className="hidden">
                    {validMenuItems.map(item => (
                      <TabsTrigger key={item.id} value={item.id}>
                        {item.label || 'Sem título'}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Tab Contents */}
                  <SafeErrorBoundary componentName="TabContentRenderer">
                    <TabContentRenderer activeTab={activeTab} />
                  </SafeErrorBoundary>
                </Tabs>
              </SafeErrorBoundary>
            </div>
          </main>
        </div>

        {/* Bottom Navigation for Mobile - Always visible on mobile */}
        {isMobile && (
          <SafeErrorBoundary componentName="BottomNavigation">
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </SafeErrorBoundary>
        )}
      </div>
    </SafeErrorBoundary>
  );
};

export default AdminDashboard;
