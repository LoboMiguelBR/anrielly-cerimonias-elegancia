
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import DesktopSidebar from "@/components/admin/navigation/DesktopSidebar";
import TabContentRenderer from "@/components/admin/navigation/TabContentRenderer";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { getAllMenuItems } from "@/components/admin/config/menuConfig";
import { transformQuoteRequests } from "@/components/admin/utils/dataTransforms";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: quoteRequests = [], isLoading } = useQuoteRequests();

  // Transform quote requests data to match expected format
  const transformedQuoteRequests = transformQuoteRequests(quoteRequests);

  const allMenuItems = getAllMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Mobile Navigation */}
        <MobileAdminNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          <div className="p-6">
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
    </div>
  );
};

export default AdminDashboard;
