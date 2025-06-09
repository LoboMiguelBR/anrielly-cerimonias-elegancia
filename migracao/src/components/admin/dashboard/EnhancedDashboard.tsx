
import React from 'react';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';
import RevenueChart from './RevenueChart';
import BusinessInsights from './BusinessInsights';
import QuoteRequestsTable from '../QuoteRequestsTable';

interface EnhancedDashboardProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    date: string;
    eventType: string;
    phone: string;
    status: string;
    email: string;
    eventLocation: string;
  }>;
  quoteRequestsCount: number;
  proposalsCount: number;
  galleryCount: number;
  testimonialsCount: number;
  questionariosCount: number;
}

const EnhancedDashboard = ({
  quoteRequests,
  quoteRequestsCount,
  proposalsCount,
  galleryCount,
  testimonialsCount,
  questionariosCount
}: EnhancedDashboardProps) => {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Principal</h1>
        <p className="text-gray-600">Visão geral completa do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        quoteRequestsCount={quoteRequestsCount}
        proposalsCount={proposalsCount}
        galleryCount={galleryCount}
        testimonialsCount={testimonialsCount}
        questionariosCount={questionariosCount}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Tables */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart />
          
          <div className="bg-white rounded-lg shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orçamentos Recentes</h3>
            <QuoteRequestsTable quoteRequests={quoteRequests.slice(0, 5)} />
          </div>
        </div>

        {/* Right Column - Activity Feed and Insights */}
        <div className="space-y-8">
          <ActivityFeed />
          <BusinessInsights />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
