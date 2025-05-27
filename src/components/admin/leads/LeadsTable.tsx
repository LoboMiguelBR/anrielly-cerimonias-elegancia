
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Search, Filter, Phone, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  message?: string;
  status?: string;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

const LeadsTable = ({ leads, isLoading }: LeadsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useMobileLayout();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'aguardando':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Aguardando</Badge>;
      case 'convertido':
        return <Badge variant="outline" className="text-green-600 border-green-200">Convertido</Badge>;
      case 'perdido':
        return <Badge variant="outline" className="text-red-600 border-red-200">Perdido</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-200">Novo</Badge>;
    }
  };

  const getEventTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'casamento': 'Casamento',
      'aniversario': 'Aniversário',
      'formatura': 'Formatura',
      'corporativo': 'Corporativo',
      'batizado': 'Batizado',
      'debutante': '15 Anos',
      'outro': 'Outro'
    };
    return types[type] || type;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

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
      <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'items-center'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="aguardando">Aguardando</SelectItem>
            <SelectItem value="convertido">Convertido</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum lead encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                      {getStatusBadge(lead.status)}
                    </div>
                    
                    <div className={`grid gap-2 text-sm text-gray-600 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </div>
                      <div>
                        <strong>Evento:</strong> {getEventTypeLabel(lead.event_type)}
                      </div>
                      <div>
                        <strong>Local:</strong> {lead.event_location}
                      </div>
                    </div>
                    
                    {lead.event_date && (
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Data:</strong> {format(new Date(lead.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Criado em {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                    className={isMobile ? 'w-full' : ''}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Evento</label>
                  <p className="text-gray-900">{getEventTypeLabel(selectedLead.event_type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Local</label>
                  <p className="text-gray-900">{selectedLead.event_location}</p>
                </div>
                {selectedLead.event_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data do Evento</label>
                    <p className="text-gray-900">
                      {format(new Date(selectedLead.event_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Criado em</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedLead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              {selectedLead.message && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Mensagem</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedLead.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsTable;
