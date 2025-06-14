
import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  // gire o tab ativo no futuro para navegação, mas para dashboard é fixo em "dashboard"
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AdminHeader />
      <main className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao painel administrativo
          </p>
        </div>
        <DashboardOverview />
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
