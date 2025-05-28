
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import DesktopSidebar from "@/components/admin/navigation/DesktopSidebar";
import BottomNavigation from "@/components/admin/mobile/BottomNavigation";
import TabContentRenderer from "@/components/admin/navigation/TabContentRenderer";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { getAllMenuItems } from "@/components/admin/config/menuConfig";
import { transformQuoteRequests } from "@/components/admin/utils/dataTransforms";
import { useMobileLayout } from "@/hooks/useMobileLayout";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: quoteRequests = [], isLoading } = useQuoteRequests();
  const { isMobile } = useMobileLayout();

  // Transform quote requests data to match expected format
  const transformedQuoteRequests = transformQuoteRequests(quoteRequests);

  const allMenuItems = getAllMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Mobile Navigation (legacy - will be replaced by bottom nav) */}
        <MobileAdminNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'lg:pl-0'}`}>
          <div className="p-4 md:p-6">
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
              <TabContentRenderer transformedQuoteRequests={transformedQuoteRequests} />
            </Tabs>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default AdminDashboard;
