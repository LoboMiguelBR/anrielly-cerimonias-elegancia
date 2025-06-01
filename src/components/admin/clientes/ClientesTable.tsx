
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useClienteActions } from '@/hooks/useClienteActions';
import { Cliente } from '@/hooks/useClientes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientesTableProps {
  clientes: Cliente[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ClientesTable = ({ clientes, isLoading, onRefresh }: ClientesTableProps) => {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteCliente, loading: actionLoading } = useClienteActions();

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return <Badge variant="outline" className="text-green-600 border-green-200">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="outline" className="text-red-600 border-red-200">Inativo</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">{status}</Badge>;
    }
  };

  const getOriginBadge = (origin: string) => {
    switch (origin) {
      case 'lead_convertido':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Lead Convertido</Badge>;
      case 'questionario':
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Questionário</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">{origin}</Badge>;
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    searchTerm === '' ||
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingCliente) return;
    
    const success = await deleteCliente(deletingCliente.id);
    if (success) {
      onRefresh();
      setDeletingCliente(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por nome, email ou tipo de evento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredClientes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{cliente.name}</h3>
                      {getStatusBadge(cliente.status)}
                      {getOriginBadge(cliente.origin)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {cliente.phone}
                      </div>
                      <div>
                        <strong>Evento:</strong> {cliente.event_type}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <strong>Local:</strong> {cliente.event_location}
                      </div>
                      {cliente.event_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <strong>Data:</strong> {format(new Date(cliente.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Criado em {format(new Date(cliente.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCliente(cliente)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingCliente(cliente)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedCliente} onOpenChange={() => setSelectedCliente(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          
          {selectedCliente && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedCliente.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedCliente.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedCliente.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{selectedCliente.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Evento</label>
                  <p className="text-gray-900">{selectedCliente.event_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Local</label>
                  <p className="text-gray-900">{selectedCliente.event_location}</p>
                </div>
                {selectedCliente.event_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data do Evento</label>
                    <p className="text-gray-900">
                      {format(new Date(selectedCliente.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Origem</label>
                  <div className="mt-1">{getOriginBadge(selectedCliente.origin)}</div>
                </div>
              </div>
              
              {selectedCliente.message && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Mensagem</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedCliente.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingCliente} onOpenChange={() => setDeletingCliente(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o cliente "{deletingCliente?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientesTable;
