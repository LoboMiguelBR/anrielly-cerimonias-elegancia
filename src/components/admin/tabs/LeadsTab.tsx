import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QuoteRequestsTable from '../QuoteRequestsTable';
import AddLeadForm from '../leads/AddLeadForm';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { transformQuoteRequests } from '../utils/dataTransforms';

const LeadsTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: leads, isLoading, error, mutate } = useQuoteRequests();
  const { isMobile } = useMobileLayout();

  const handleLeadAdded = () => {
    setShowAddDialog(false);
    mutate();
  };

  const stats = {
    total: leads?.length || 0,
    aguardando: leads?.filter(l => l.status === 'aguardando').length || 0,
    respondido: leads?.filter(l => l.status === 'respondido').length || 0,
    convertido: leads?.filter(l => l.status === 'convertido').length || 0,
    rejeitado: leads?.filter(l => l.status === 'rejeitado').length || 0,
  };

  const transformedLeads = leads ? transformQuoteRequests(leads) : [];

  return (
    <div className={`space-y-4 min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <div className="flex flex-col gap-4 justify-between items-start">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
            {isMobile ? 'Leads' : 'Gestão de Leads'}
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Gerencie seus leads'
              : 'Gerencie solicitações de orçamento e leads'}
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className={`bg-purple-500 hover:bg-purple-600 text-white ${isMobile ? 'w-full h-12 text-base' : ''}`}>
              <Plus className="w-4 h-4 mr-2" />
              {isMobile ? 'Novo Lead' : 'Adicionar Lead'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <AddLeadForm onSuccess={handleLeadAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-5'}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <Users className="w-4 h-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
              {stats.total}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <Clock className="w-4 h-4" />
              Aguardando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-orange-600`}>
              {stats.aguardando}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <CheckCircle className="w-4 h-4" />
              Respondido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
              {stats.respondido}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <CheckCircle className="w-4 h-4" />
              Convertido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
              {stats.convertido}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <XCircle className="w-4 h-4" />
              Rejeitado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-red-600`}>
              {stats.rejeitado}
            </div>
          </CardContent>
        </Card>
      </div>

      <QuoteRequestsTable 
        quoteRequests={transformedLeads}
        onRefresh={() => mutate()} 
      />
    </div>
  );
};

export default LeadsTab;
