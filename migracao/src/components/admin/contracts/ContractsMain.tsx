
import { useContracts } from '../hooks/contract/useContracts';
import { useContractActions } from './hooks/useContractActions';
import ContractsHeader from './views/ContractsHeader';
import ContractView from './views/ContractView';
import ContractsTable from './ContractsTable';
import ContractForm from './ContractForm';
import ContractDeleteDialog from './dialogs/ContractDeleteDialog';

const ContractsMain = () => {
  const {
    contracts,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    refetch
  } = useContracts();

  const {
    currentView,
    selectedContract,
    contractToDelete,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleView,
    handleDownload,
    handleDelete,
    confirmDelete,
    handleSubmit,
    handleCancel,
    setContractToDelete
  } = useContractActions({ createContract, updateContract, deleteContract });

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
      <ContractView
        contract={selectedContract}
        onEdit={() => handleEdit(selectedContract)}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ContractsHeader />

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

      <ContractDeleteDialog
        contract={contractToDelete}
        isOpen={!!contractToDelete}
        onClose={() => setContractToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ContractsMain;
