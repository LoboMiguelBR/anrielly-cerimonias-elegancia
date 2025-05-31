
import { useState } from "react";
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

  const allMenuItems = getAllMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Mobile Navigation (legacy - hidden in favor of bottom nav) */}
        <div className="hidden">
          <MobileAdminNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'lg:pl-0'} min-h-screen`}>
          <div className={`${isMobile ? 'p-2' : 'p-4 md:p-6'}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Hidden TabsList for accessibility */}
              <TabsList className="hidden">
                {allMenuItems.map(item => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label}
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
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
