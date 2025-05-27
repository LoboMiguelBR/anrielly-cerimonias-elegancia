
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ContractData } from '../hooks/contract/types';
import {
  ContractsTableHeader,
  ContractsTableFilters,
  ContractsTableContent,
  ContractsTableEmpty
} from './table';

interface ContractsTableProps {
  contracts: ContractData[];
  isLoading: boolean;
  onView: (contract: ContractData) => void;
  onEdit: (contract: ContractData) => void;
  onDownload: (contract: ContractData) => void;
  onDelete: (contract: ContractData) => void;
  onCreate: () => void;
  onRefresh?: () => void;
}

const ContractsTable = ({
  contracts,
  isLoading,
  onView,
  onEdit,
  onDownload,
  onDelete,
  onCreate,
  onRefresh
}: ContractsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p>Carregando contratos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ContractsTableHeader 
        totalContracts={filteredContracts.length}
        onCreate={onCreate}
      />
      
      <ContractsTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <CardContent>
        {filteredContracts.length === 0 ? (
          <ContractsTableEmpty
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onCreate={onCreate}
          />
        ) : (
          <ContractsTableContent
            contracts={filteredContracts}
            onView={onView}
            onEdit={onEdit}
            onDownload={onDownload}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContractsTable;
