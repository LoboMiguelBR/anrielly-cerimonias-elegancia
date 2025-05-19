
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Image, MessageCircle, FileText, Camera } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardTab from '@/components/admin/tabs/DashboardTab';
import GalleryTab from '@/components/admin/tabs/GalleryTab';
import TestimonialsTab from '@/components/admin/tabs/TestimonialsTab';
import QuotesTab from '@/components/admin/tabs/QuotesTab';
import ProposalsTab from '@/components/admin/tabs/ProposalsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dados simulados (posteriormente virão do Supabase)
  const quoteRequests = [
    { id: 1, name: 'Maria Silva', date: '2025-08-15', eventType: 'casamento', phone: '(24) 99999-0000', status: 'novo', email: 'maria@example.com', eventLocation: 'Volta Redonda, RJ' },
    { id: 2, name: 'João Santos', date: '2025-07-22', eventType: 'corporativo', phone: '(24) 98888-1111', status: 'novo', email: 'joao@example.com', eventLocation: 'Barra Mansa, RJ' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 border rounded-md w-full flex overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center">
              <Image className="w-4 h-4 mr-2" /> Galeria
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" /> Depoimentos
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Orçamentos
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center">
              <Camera className="w-4 h-4 mr-2" /> Propostas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardTab quoteRequests={quoteRequests} />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          
          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>
          
          <TabsContent value="quotes">
            <QuotesTab quoteRequests={quoteRequests} />
          </TabsContent>
          
          <TabsContent value="proposals">
            <ProposalsTab quoteRequests={quoteRequests} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
