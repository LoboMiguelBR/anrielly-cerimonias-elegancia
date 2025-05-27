
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Image, MessageCircle, FileText, Camera, Palette, Heart } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import MobileAdminNav from '@/components/admin/MobileAdminNav';
import DashboardTab from '@/components/admin/tabs/DashboardTab';
import GalleryTab from '@/components/admin/tabs/GalleryTab';
import TestimonialsTab from '@/components/admin/tabs/TestimonialsTab';
import QuotesTab from '@/components/admin/tabs/QuotesTab';
import ProposalsTab from '@/components/admin/tabs/ProposalsTab';
import ProposalTemplatesTab from '@/components/admin/tabs/ProposalTemplatesTab';
import QuestionariosTab from '@/components/admin/tabs/QuestionariosTab';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const quoteIdFromUrl = searchParams.get('quoteId');
  const { isMobile } = useMobileLayout();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "dashboard");
  const { data: quoteRequests } = useQuoteRequests();

  // Format quote requests for the dashboard
  const formattedQuoteRequests = quoteRequests?.map(request => ({
    id: request.id,
    name: request.name,
    date: request.event_date || '',
    eventType: request.event_type,
    phone: request.phone,
    status: request.status,
    email: request.email,
    eventLocation: request.event_location
  })) || [];

  // Update URL when tab changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeTab);
    setSearchParams(newParams);
  }, [activeTab, setSearchParams, searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-4 lg:py-8">
        <div className="flex items-center gap-4 mb-6 lg:hidden">
          <MobileAdminNav activeTab={activeTab} onTabChange={handleTabChange} />
          <h1 className="font-playfair text-xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'gallery' && 'Galeria'}
            {activeTab === 'testimonials' && 'Depoimentos'}
            {activeTab === 'quotes' && 'Orçamentos'}
            {activeTab === 'proposals' && 'Propostas'}
            {activeTab === 'templates' && 'Templates'}
            {activeTab === 'questionarios' && 'Questionários'}
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 lg:space-y-8">
          {!isMobile && (
            <TabsList className="bg-white p-1 border rounded-md w-full flex overflow-x-auto">
              <TabsTrigger value="dashboard" className="flex items-center min-w-fit">
                <Home className="w-4 h-4 mr-2" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center min-w-fit">
                <Image className="w-4 h-4 mr-2" /> Galeria
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center min-w-fit">
                <MessageCircle className="w-4 h-4 mr-2" /> Depoimentos
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center min-w-fit">
                <FileText className="w-4 h-4 mr-2" /> Orçamentos
              </TabsTrigger>
              <TabsTrigger value="proposals" className="flex items-center min-w-fit">
                <Camera className="w-4 h-4 mr-2" /> Propostas
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center min-w-fit">
                <Palette className="w-4 h-4 mr-2" /> Templates
              </TabsTrigger>
              <TabsTrigger value="questionarios" className="flex items-center min-w-fit">
                <Heart className="w-4 h-4 mr-2" /> Questionários
              </TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="dashboard">
            <DashboardTab quoteRequests={formattedQuoteRequests} />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          
          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>
          
          <TabsContent value="quotes">
            <QuotesTab />
          </TabsContent>
          
          <TabsContent value="proposals">
            <ProposalsTab quoteRequests={quoteRequests || []} quoteIdFromUrl={quoteIdFromUrl} />
          </TabsContent>
          
          <TabsContent value="templates">
            <ProposalTemplatesTab />
          </TabsContent>
          
          <TabsContent value="questionarios">
            <QuestionariosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
