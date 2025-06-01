
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, UserCheck, UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClientesTable from '../clientes/ClientesTable';
import { useClientes } from '@/hooks/useClientes';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const ClientesTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { clientes, isLoading, refetch } = useClientes();
  const { isMobile } = useMobileLayout();

  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ativo').length,
    inativos: clientes.filter(c => c.status === 'inativo').length,
    leadConvertidos: clientes.filter(c => c.origin === 'lead_convertido').length,
    questionarios: clientes.filter(c => c.origin === 'questionario').length,
  };

  return (
    <div className={`space-y-4 min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <div className="flex flex-col gap-4 justify-between items-start">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
            {isMobile ? 'Clientes' : 'Gestão de Clientes'}
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Gerencie seus clientes'
              : 'Gerencie clientes convertidos de leads ou questionários'
            }
          </p>
        </div>
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
              <UserCheck className="w-4 h-4" />
              Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
              {stats.ativos}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 flex items-center gap-1`}>
              <UserX className="w-4 h-4" />
              Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-red-600`}>
              {stats.inativos}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
              {stats.leadConvertidos}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
              Questionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>
              {stats.questionarios}
            </div>
          </CardContent>
        </Card>
      </div>

      <ClientesTable clientes={clientes} isLoading={isLoading} onRefresh={refetch} />
    </div>
  );
};

export default ClientesTab;
