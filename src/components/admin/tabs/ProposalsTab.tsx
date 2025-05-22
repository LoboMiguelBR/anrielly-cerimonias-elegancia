
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, PlusCircle } from 'lucide-react';
import ProposalsList from '../proposals/ProposalsList';
import ProposalGenerator from '../proposals/ProposalGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import DeleteConfirmationDialog from '../proposals/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { useProposalList } from '../hooks/useProposalList';
import { ProposalData } from '../hooks/proposal';

interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

interface ProposalsTabProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
}

const ProposalsTab = ({ quoteRequests, quoteIdFromUrl }: ProposalsTabProps) => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  
  const handleBackToList = () => {
    setActiveTab("list");
    setSelectedProposalId(null);
  };

  const handleCreateNew = () => {
    setSelectedProposalId(null);
    setActiveTab("create");
  };

  const handleViewProposal = (proposal: ProposalData) => {
    setSelectedProposalId(proposal.id);
    setActiveTab("view");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-playfair font-semibold mb-2">Gerenciamento de Propostas</h2>
            <p className="text-gray-500">
              Crie, edite e envie propostas personalizadas com o visual da sua marca para seus clientes.
            </p>
          </div>
          
          {activeTab === "list" && (
            <Button 
              onClick={handleCreateNew} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Nova Proposta
            </Button>
          )}
          
          {(activeTab === "create" || activeTab === "view") && (
            <Button 
              variant="outline" 
              onClick={handleBackToList}
            >
              <List className="w-4 h-4 mr-2" /> Voltar para Lista
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            <TabsTrigger value="list">
              <FileText className="w-4 h-4 mr-2" /> Propostas
            </TabsTrigger>
            <TabsTrigger value="create">
              <PlusCircle className="w-4 h-4 mr-2" /> Nova Proposta
            </TabsTrigger>
            <TabsTrigger value="view">
              <FileText className="w-4 h-4 mr-2" /> Visualizar Proposta
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <ProposalsList 
              quoteRequests={quoteRequests} 
              quoteIdFromUrl={quoteIdFromUrl}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <ProposalGenerator 
              quoteRequests={quoteRequests}
              quoteIdFromUrl={quoteIdFromUrl}
              onClose={handleBackToList}
            />
          </TabsContent>
          
          <TabsContent value="view">
            <ProposalGenerator 
              quoteRequests={quoteRequests}
              initialProposalId={selectedProposalId || undefined}
              onClose={handleBackToList}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProposalsTab;
