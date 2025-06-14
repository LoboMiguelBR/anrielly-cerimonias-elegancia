
import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao painel administrativo
          </p>
        </div>
        <DashboardOverview />
      </main>
    </div>
  );
};

export default AdminDashboard;
