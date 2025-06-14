
import React from "react";
import DesktopSidebar from "@/components/admin/navigation/DesktopSidebar";
import MobileAdminNav from "@/components/admin/MobileAdminNav";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = "dashboard",
  onTabChange,
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <DesktopSidebar activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
      {/* Menu Mobile */}
      <MobileAdminNav activeTab={activeTab} onTabChange={onTabChange} />
      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0 px-0 md:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
