
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LeadsTable from '../leads/LeadsTable';
import AddLeadForm from '../leads/AddLeadForm';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { transformQuoteRequests } from '../utils/dataTransforms';

const LeadsTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: rawLeads, isLoading, mutate } = useQuoteRequests();
  const { isMobile } = useMobileLayout();

  // Transform the data to match LeadsTable expectations
  const leads = rawLeads ? transformQuoteRequests(rawLeads) : [];

  const handleLeadAdded = () => {
    setShowAddDialog(false);
    mutate();
  };

  return (
    <div className={`space-y-4 min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <div className="flex flex-col gap-4 justify-between items-start">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
            {isMobile ? 'Leads' : 'Gestão de Leads'}
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Gerencie seus leads capturados'
              : 'Gerencie leads capturados automaticamente ou adicione manualmente'
            }
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className={`bg-rose-500 hover:bg-rose-600 text-white ${isMobile ? 'w-full h-12 text-base' : ''}`}>
              <Plus className="w-4 h-4 mr-2" />
              {isMobile ? 'Novo Lead' : 'Adicionar Lead Manual'}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh]' : 'sm:max-w-[600px]'}`}>
            <DialogHeader>
              <DialogTitle>{isMobile ? 'Novo Lead' : 'Cadastrar Novo Lead'}</DialogTitle>
            </DialogHeader>
            <AddLeadForm onSuccess={handleLeadAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-600`}>
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              {leads?.length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-600`}>
              Aguardando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-orange-600`}>
              {leads?.filter(lead => lead.status === 'aguardando').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-600`}>
              Convertidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>
              {leads?.filter(lead => lead.status === 'convertido').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <LeadsTable 
        leads={leads || []} 
        isLoading={isLoading} 
        onRefresh={mutate} 
      />
    </div>
  );
};

export default LeadsTab;
