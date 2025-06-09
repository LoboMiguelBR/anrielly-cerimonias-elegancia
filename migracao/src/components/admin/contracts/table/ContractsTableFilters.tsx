
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

interface ContractsTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const ContractsTableFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: ContractsTableFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 px-6">
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
  );
};

export default ContractsTableFilters;
