
import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminLayout from "@/components/admin/AdminLayout";
import TabContentRenderer from "@/components/admin/navigation/TabContentRenderer";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  console.log('AdminDashboard: activeTab atual:', activeTab);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AdminHeader />
      <main className="container mx-auto px-4">
        <TabContentRenderer activeTab={activeTab} />
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
