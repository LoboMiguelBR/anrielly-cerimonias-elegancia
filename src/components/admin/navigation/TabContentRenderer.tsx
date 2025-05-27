
import { TabsContent } from "@/components/ui/tabs";
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

interface TabContentRendererProps {
  transformedQuoteRequests: Array<{
    id: string;
    name: string;
    date: string;
    eventType: string;
    phone: string;
    status: string;
    email: string;
    eventLocation: string;
  }>;
}

const TabContentRenderer = ({ transformedQuoteRequests }: TabContentRendererProps) => {
  return (
    <>
      <TabsContent value="dashboard">
        <DashboardTab quoteRequests={transformedQuoteRequests} />
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
        <ProposalsTab quoteRequests={transformedQuoteRequests} />
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
    </>
  );
};

export default TabContentRenderer;
