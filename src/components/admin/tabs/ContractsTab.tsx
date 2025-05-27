
import { useState } from 'react';
import { useContracts } from '../hooks/contract/useContracts';
import { ContractData, ContractFormData } from '../hooks/contract/types';
import ContractsTable from '../contracts/ContractsTable';
import ContractForm from '../contracts/ContractForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const ContractsTab = () => {
  const {
    contracts,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    updateContractStatus,
    refetch
  } = useContracts();

  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [contractToDelete, setContractToDelete] = useState<ContractData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedContract(null);
    setCurrentView('create');
  };

  const handleEdit = (contract: ContractData) => {
    setSelectedContract(contract);
    setCurrentView('edit');
  };

  const handleView = (contract: ContractData) => {
    setSelectedContract(contract);
    setCurrentView('view');
  };

  const handleDownload = (contract: ContractData) => {
    if (contract.pdf_url) {
      window.open(contract.pdf_url, '_blank');
    } else {
      toast.error('PDF não disponível para este contrato');
    }
  };

  const handleDelete = (contract: ContractData) => {
    setContractToDelete(contract);
  };

  const confirmDelete = async () => {
    if (contractToDelete) {
      const success = await deleteContract(contractToDelete.id);
      if (success) {
        setContractToDelete(null);
      }
    }
  };

  const handleSubmit = async (formData: ContractFormData) => {
    setIsSubmitting(true);
    try {
      let success = false;
      
      if (currentView === 'create') {
        const contractId = await createContract(formData);
        success = !!contractId;
      } else if (currentView === 'edit' && selectedContract) {
        success = await updateContract(selectedContract.id, formData);
      }

      if (success) {
        setCurrentView('list');
        setSelectedContract(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedContract(null);
  };

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <ContractForm
        initialData={currentView === 'edit' ? selectedContract || undefined : undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    );
  }

  if (currentView === 'view' && selectedContract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualizar Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Cliente:</strong> {selectedContract.client_name}
              </div>
              <div>
                <strong>Email:</strong> {selectedContract.client_email}
              </div>
              <div>
                <strong>Telefone:</strong> {selectedContract.client_phone}
              </div>
              <div>
                <strong>Evento:</strong> {selectedContract.event_type}
              </div>
              <div>
                <strong>Data:</strong> {selectedContract.event_date ? new Date(selectedContract.event_date).toLocaleDateString('pt-BR') : '-'}
              </div>
              <div>
                <strong>Local:</strong> {selectedContract.event_location}
              </div>
              <div>
                <strong>Valor Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedContract.total_price)}
              </div>
              <div>
                <strong>Status:</strong> {selectedContract.status}
              </div>
            </div>
            
            {selectedContract.notes && (
              <div>
                <strong>Observações:</strong>
                <p className="mt-1 text-gray-600">{selectedContract.notes}</p>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setCurrentView('edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Voltar
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-blue-200">
        <h2 className="text-2xl font-playfair font-semibold mb-2">Gestão de Contratos</h2>
        <p className="text-gray-500">
          Crie, gerencie e envie contratos digitais para seus clientes com assinatura eletrônica.
        </p>
      </div>

      <ContractsTable
        contracts={contracts}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onRefresh={refetch}
      />

      <AlertDialog open={!!contractToDelete} onOpenChange={() => setContractToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contrato de "{contractToDelete?.client_name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractsTab;
