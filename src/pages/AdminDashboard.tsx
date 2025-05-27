
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  Calculator, 
  FileText, 
  ClipboardList,
  ScrollText,
  Mail,
  ImageIcon,
  MessageSquare,
  HelpCircle
} from "lucide-react";

// Import tabs
import DashboardTab from "@/components/admin/tabs/DashboardTab";
import LeadsTab from "@/components/admin/tabs/LeadsTab";
import ProfessionalsTab from "@/components/admin/tabs/ProfessionalsTab";
import QuotesTab from "@/components/admin/tabs/QuotesTab";
import ProposalsTab from "@/components/admin/tabs/ProposalsTab";
import ProposalTemplatesTab from "@/components/admin/tabs/ProposalTemplatesTab";
import ContractsTab from "@/components/admin/tabs/ContractsTab";
import ContractTemplatesTab from "@/components/admin/tabs/ContractTemplatesTab";
import ContractEmailTemplatesTab from "@/components/admin/tabs/ContractEmailTemplatesTab";
import AdminGalleryTab from "@/components/admin/tabs/AdminGalleryTab";
import TestimonialsTab from "@/components/admin/tabs/TestimonialsTab";
import QuestionariosTab from "@/components/admin/tabs/QuestionariosTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuSections = [
    {
      title: "📊 DASHBOARD",
      items: [
        { id: "dashboard", label: "Dashboard Principal", icon: BarChart3 }
      ]
    },
    {
      title: "👥 LEADS & CLIENTES",
      items: [
        { id: "leads", label: "Leads", icon: Users },
        { id: "professionals", label: "Profissionais", icon: UserPlus }
      ]
    },
    {
      title: "💰 VENDAS",
      items: [
        { id: "quotes", label: "Orçamentos", icon: Calculator },
        { id: "proposals", label: "Propostas", icon: FileText },
        { id: "proposal-templates", label: "Templates de Propostas", icon: FileText }
      ]
    },
    {
      title: "📝 CONTRATOS",
      items: [
        { id: "contracts", label: "Contratos", icon: ScrollText },
        { id: "contract-templates", label: "Templates de Contratos", icon: ClipboardList },
        { id: "contract-email-templates", label: "Templates de Email", icon: Mail }
      ]
    },
    {
      title: "🎨 CONTEÚDO",
      items: [
        { id: "gallery", label: "Galeria", icon: ImageIcon },
        { id: "testimonials", label: "Depoimentos", icon: MessageSquare },
        { id: "questionarios", label: "Questionários", icon: HelpCircle }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white shadow-sm border-r h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu de Navegação</h2>
            
            <div className="space-y-6">
              {menuSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  {sectionIndex < menuSections.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <MobileAdminNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Hidden TabsList for accessibility */}
              <TabsList className="hidden">
                {menuSections.flatMap(section => 
                  section.items.map(item => (
                    <TabsTrigger key={item.id} value={item.id}>
                      {item.label}
                    </TabsTrigger>
                  ))
                )}
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="dashboard">
                <DashboardTab />
              </TabsContent>

              <TabsContent value="leads">
                <LeadsTab />
              </TabsContent>

              <TabsContent value="professionals">
                <ProfessionalsTab />
              </TabsContent>

              <TabsContent value="quotes">
                <QuotesTab />
              </TabsContent>

              <TabsContent value="proposals">
                <ProposalsTab />
              </TabsContent>

              <TabsContent value="proposal-templates">
                <ProposalTemplatesTab />
              </TabsContent>

              <TabsContent value="contracts">
                <ContractsTab />
              </TabsContent>

              <TabsContent value="contract-templates">
                <ContractTemplatesTab />
              </TabsContent>

              <TabsContent value="contract-email-templates">
                <ContractEmailTemplatesTab />
              </TabsContent>

              <TabsContent value="gallery">
                <AdminGalleryTab />
              </TabsContent>

              <TabsContent value="testimonials">
                <TestimonialsTab />
              </TabsContent>

              <TabsContent value="questionarios">
                <QuestionariosTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
