
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractData } from '../hooks/contract/types';
import ContractStatusBadge from './ContractStatusBadge';
import ContractActions from './ContractActions';
import { Eye, Edit, Download, Trash2, Plus, Search, Filter } from 'lucide-react';

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
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
          <Button onClick={onCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente, email ou evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="signed">Assinado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredContracts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum contrato encontrado com os filtros aplicados.'
                : 'Nenhum contrato encontrado. Crie seu primeiro contrato!'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Contrato
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contract.client_name}</p>
                        <p className="text-sm text-gray-500">{contract.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contract.event_type}</p>
                        <p className="text-sm text-gray-500">{contract.event_location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.event_date ? (
                        <div>
                          <p>{new Date(contract.event_date).toLocaleDateString('pt-BR')}</p>
                          {contract.event_time && (
                            <p className="text-sm text-gray-500">{contract.event_time}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(contract.total_price)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <ContractStatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(contract)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {contract.status !== 'signed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(contract)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {contract.pdf_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(contract)}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(contract)}
                          title="Excluir"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <ContractActions 
                          contract={contract} 
                          onStatusUpdate={onRefresh}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractsTable;
