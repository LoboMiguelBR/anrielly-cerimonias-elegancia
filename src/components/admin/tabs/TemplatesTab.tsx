
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, FileText, Mail, ClipboardList } from "lucide-react";
import QuestionarioTemplatesManager from "./components/QuestionarioTemplatesManager";
import ProposalTemplatesManager from "../proposals/templates/ProposalTemplatesManager";
import ContractTemplatesManager from "../contracts/templates/ContractTemplatesManager";
import ContractEmailTemplatesManager from "../contracts/email-templates/ContractEmailTemplatesManager";

const TemplatesTab = () => {
  const [activeTab, setActiveTab] = useState('questionarios');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Central de Templates</h2>
          <p className="text-gray-600">Gerencie todos os templates da plataforma em um só local</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('questionarios')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questionários</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Templates</div>
            <p className="text-xs text-muted-foreground">Para diferentes eventos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('propostas')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Templates</div>
            <p className="text-xs text-muted-foreground">Modelos de propostas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('contratos')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Templates</div>
            <p className="text-xs text-muted-foreground">Modelos de contratos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('emails')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Templates</div>
            <p className="text-xs text-muted-foreground">Modelos de e-mail</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Templates */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

        <TabsContent value="questionarios" className="mt-6">
          <QuestionarioTemplatesManager />
        </TabsContent>

        <TabsContent value="propostas" className="mt-6">
          <ProposalTemplatesManager />
        </TabsContent>

        <TabsContent value="contratos" className="mt-6">
          <ContractTemplatesManager />
        </TabsContent>

        <TabsContent value="emails" className="mt-6">
          <ContractEmailTemplatesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesTab;
