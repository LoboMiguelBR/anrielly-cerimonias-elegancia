
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, FileText, Mail, Layout } from "lucide-react";
import QuestionarioTemplatesManager from "./components/QuestionarioTemplatesManager";
import ProposalTemplatesManager from "../proposals/templates/ProposalTemplatesManager";
import ContractTemplatesManager from "../contracts/templates/ContractTemplatesManager";
import ContractEmailTemplatesManager from "../contracts/email-templates/ContractEmailTemplatesManager";

const TemplatesTab = () => {
  const [activeTab, setActiveTab] = useState("questionarios");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
        <p className="text-gray-600">Gerencie todos os templates do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Questionários
          </TabsTrigger>
          <TabsTrigger value="propostas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Propostas
          </TabsTrigger>
          <TabsTrigger value="contratos" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-mails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionarios">
          <QuestionarioTemplatesManager />
        </TabsContent>

        <TabsContent value="propostas">
          <ProposalTemplatesManager />
        </TabsContent>

        <TabsContent value="contratos">
          <ContractTemplatesManager />
        </TabsContent>

        <TabsContent value="emails">
          <ContractEmailTemplatesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesTab;
