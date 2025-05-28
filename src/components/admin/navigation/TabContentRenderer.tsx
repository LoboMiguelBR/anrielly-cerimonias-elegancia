
import { TabsContent } from "@/components/ui/tabs";
import DashboardTab from "../tabs/DashboardTab";
import QuotesTab from "../tabs/QuotesTab";
import ProposalsTab from "../tabs/ProposalsTab";
import ContractsTab from "../tabs/ContractsTab";
import AdminGalleryTab from "../tabs/AdminGalleryTab";
import TestimonialsTab from "../tabs/TestimonialsTab";
import QuestionariosTab from "../tabs/QuestionariosTab";
import HistoriasCasaisTab from "../tabs/HistoriasCasaisTab";
import LeadsTab from "../tabs/LeadsTab";
import ProfessionalsTab from "../tabs/ProfessionalsTab";
import ProposalTemplatesTab from "../tabs/ProposalTemplatesTab";
import ContractTemplatesTab from "../tabs/ContractTemplatesTab";
import ContractEmailTemplatesTab from "../tabs/ContractEmailTemplatesTab";

interface TabContentRendererProps {
  transformedQuoteRequests: any[];
}

const TabContentRenderer = ({ transformedQuoteRequests }: TabContentRendererProps) => {
  return (
    <>
      <TabsContent value="dashboard">
        <DashboardTab quoteRequests={transformedQuoteRequests} />
      </TabsContent>

      <TabsContent value="quotes">
        <QuotesTab />
      </TabsContent>

      <TabsContent value="proposals">
        <ProposalsTab quoteRequests={transformedQuoteRequests} />
      </TabsContent>

      <TabsContent value="contracts">
        <ContractsTab />
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

      <TabsContent value="historias-casais">
        <HistoriasCasaisTab />
      </TabsContent>

      <TabsContent value="leads">
        <LeadsTab />
      </TabsContent>

      <TabsContent value="professionals">
        <ProfessionalsTab />
      </TabsContent>

      <TabsContent value="proposal-templates">
        <ProposalTemplatesTab />
      </TabsContent>

      <TabsContent value="contract-templates">
        <ContractTemplatesTab />
      </TabsContent>

      <TabsContent value="contract-email-templates">
        <ContractEmailTemplatesTab />
      </TabsContent>
    </>
  );
};

export default TabContentRenderer;
