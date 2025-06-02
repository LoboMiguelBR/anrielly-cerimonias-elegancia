
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import DesktopSidebar from "@/components/admin/navigation/DesktopSidebar";
import BottomNavigation from "@/components/admin/mobile/BottomNavigation";
import TabContentRenderer from "@/components/admin/navigation/TabContentRenderer";
import { getAllMenuItems } from "@/components/admin/config/menuConfig";
import { useMobileLayout } from "@/hooks/useMobileLayout";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isMobile } = useMobileLayout();

  // Verificação de segurança para garantir que activeTab sempre tenha um valor válido
  useEffect(() => {
    if (!activeTab || typeof activeTab !== 'string') {
      console.warn('AdminDashboard: Invalid activeTab, resetting to dashboard');
      setActiveTab("dashboard");
    }
  }, [activeTab]);

  const allMenuItems = getAllMenuItems();

  // Verificação de segurança para getAllMenuItems
  const validMenuItems = Array.isArray(allMenuItems) ? allMenuItems.filter(item => 
    item && item.id && typeof item.id === 'string'
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
      setActiveTab(newTab);
    } catch (error) {
      console.error('AdminDashboard: Error changing tab', error);
      setActiveTab("dashboard"); // Fallback seguro
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DesktopSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {/* Mobile Navigation (legacy - hidden in favor of bottom nav) */}
        <div className="hidden">
          <MobileAdminNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'lg:pl-0'} min-h-screen`}>
          <div className={`${isMobile ? 'p-2' : 'p-4 md:p-6'}`}>
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
              <TabContentRenderer activeTab={activeTab} />
            </Tabs>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile - Always visible on mobile */}
      {isMobile && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
