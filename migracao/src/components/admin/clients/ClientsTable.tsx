
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Client } from '@/hooks/useClients';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  onUpdate: (id: string, updates: any) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

const ClientsTable = ({ clients, isLoading, onUpdate, onDelete, onRefresh }: ClientsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'prospecto': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTypeLabel = (type: string | null) => {
    switch (type) {
      case 'pessoa_fisica': return 'Pessoa Física';
      case 'pessoa_juridica': return 'Pessoa Jurídica';
      default: return 'Não informado';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Todos os Status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="prospecto">Prospecto</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    {client.partner_name && (
                      <div className="text-sm text-gray-500">
                        Parceiro(a): {client.partner_name}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getClientTypeLabel(client.client_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.event_type}</div>
                    {client.event_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(client.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    )}
                    {client.event_location && (
                      <div className="text-sm text-gray-500">{client.event_location}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status || 'Não definido'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.created_at && format(new Date(client.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => onDelete(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Nenhum cliente encontrado com os filtros aplicados.' 
              : 'Nenhum cliente cadastrado ainda.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
